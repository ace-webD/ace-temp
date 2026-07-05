// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import {
  getPaymentByRazorpayId,
  updatePaymentStatus,
  updateRegistrationPaymentStatus,
} from '@/lib/supabase-service';
import { WebhookEvent } from '@/lib/types/payment';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing signature' },
        { status: 401 }
      );
    }

    const isSignatureValid = verifyWebhookSignature(rawBody, signature);
    if (!isSignatureValid) {
      console.warn('Invalid webhook signature');
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData: WebhookEvent = JSON.parse(rawBody);
    const { event, payload } = webhookData;

    console.log(`Webhook received: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const razorpayPaymentId = payment.id;

      const dbPayment = await getPaymentByRazorpayId(razorpayPaymentId);

      if (!dbPayment) {
        console.warn('Payment not found in database:', razorpayPaymentId);
        return NextResponse.json({
          success: false,
          message: 'Payment not found',
        });
      }

      await updatePaymentStatus(dbPayment.id, 'completed', razorpayPaymentId);
      await updateRegistrationPaymentStatus(
        dbPayment.registrationId,
        dbPayment.id,
        'completed'
      );

      console.log('Payment captured and updated:', razorpayPaymentId);
    } else if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      const razorpayPaymentId = payment.id;

      const dbPayment = await getPaymentByRazorpayId(razorpayPaymentId);
      if (dbPayment) {
        await updatePaymentStatus(dbPayment.id, 'failed', razorpayPaymentId);
        await updateRegistrationPaymentStatus(
          dbPayment.registrationId,
          dbPayment.id,
          'failed'
        );
      }

      console.log('Payment failed:', razorpayPaymentId);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
    });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}