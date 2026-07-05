// app/api/payments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { savePayment, getEvent, getRegistration } from '@/lib/supabase-service';
import { PaymentPayload, PaymentResponse } from '@/lib/types/payment';

export async function POST(request: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    const body: PaymentPayload = await request.json();
    const { eventId, userId, registrationId, amount, email, phoneNumber, userName } = body;

    if (!eventId || !userId || !registrationId || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: eventId, userId, registrationId, amount',
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Amount must be greater than 0',
        },
        { status: 400 }
      );
    }

    const event = await getEvent(eventId);
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    if (event.registrationFee !== amount) {
      return NextResponse.json(
        {
          success: false,
          message: `Amount mismatch. Expected ₹${event.registrationFee}, got ₹${amount}`,
        },
        { status: 400 }
      );
    }

    const registration = await getRegistration(registrationId);
    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration not found',
        },
        { status: 404 }
      );
    }

    const amountInPaise = Math.round(amount * 100);
    const receipt = `PAY-${Date.now()}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        eventId,
        userId,
        registrationId,
      },
    });

    const payment = await savePayment({
      registrationId,
      eventId,
      userId,
      amount,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: 'razorpay',
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: razorpayOrder.id,
      amount: amountInPaise,
    });
  } catch (error) {
    console.error('Payment Creation Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create payment order',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}