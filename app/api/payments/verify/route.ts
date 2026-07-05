// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, fetchPaymentDetails } from '@/lib/razorpay';
import {
  updatePaymentStatus,
  getPaymentByRazorpayId,
  updateRegistrationPaymentStatus,
} from '@/lib/supabase-service';
import { RazorpayPaymentVerification, PaymentResponse } from '@/lib/types/payment';

export async function POST(request: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    const body: RazorpayPaymentVerification = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing verification data',
        },
        { status: 400 }
      );
    }

    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      console.warn('Invalid payment signature:', {
        razorpay_order_id,
        razorpay_payment_id,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed. Invalid signature.',
        },
        { status: 401 }
      );
    }

    const existingPayment = await getPaymentByRazorpayId(razorpay_payment_id);
    if (existingPayment && existingPayment.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
      });
    }

    const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

    if (paymentDetails.status !== 'captured') {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment not captured by Razorpay',
        },
        { status: 400 }
      );
    }

    const updatedPayment = await updatePaymentStatus(
      existingPayment.id,
      'completed',
      razorpay_payment_id,
      razorpay_signature
    );

    await updateRegistrationPaymentStatus(
      updatedPayment.registrationId,
      updatedPayment.id,
      'completed'
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified and registered successfully',
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}