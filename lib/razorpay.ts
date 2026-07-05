// lib/razorpay.ts
import axios from 'axios';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    eventId: string;
    userId: string;
    registrationId: string;
  };
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes,
      },
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }  catch (error: any) {
    console.error('=== RAZORPAY ERROR DETAILS ===');
    console.error('Error:', error);
    console.error('Status:', error?.response?.status);
    console.error('Data:', error?.response?.data);
    console.error('Message:', error?.message);
    console.error('Keys loaded:', {
      keyId: RAZORPAY_KEY_ID ? 'YES' : 'NO',
      keySecret: RAZORPAY_KEY_SECRET ? 'YES' : 'NO'
    });
    console.error('================================');
    throw new Error('Failed to create Razorpay order');
}
}

export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  try {
    const body = razorpayOrderId + '|' + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );
  } catch (error) {
    console.error('Signature Verification Error:', error);
    return false;
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Webhook Signature Verification Error:', error);
    return false;
  }
}

export async function fetchPaymentDetails(paymentId: string) {
  try {
    const response = await axios.get(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Fetch Payment Details Error:', error);
    throw new Error('Failed to fetch payment details');
  }
}

export async function createRefund(paymentId: string, amount?: number) {
  try {
    const response = await axios.post(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      amount ? { amount } : {},
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Refund Error:', error);
    throw new Error('Failed to create refund');
  }
}