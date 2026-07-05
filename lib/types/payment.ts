// lib/types/payment.ts

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: {
    eventId: string;
    userId: string;
    registrationId: string;
  };
  created_at: number;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentPayload {
  eventId: string;
  userId: string;
  registrationId: string;
  amount: number;
  email: string;
  phoneNumber: string;
  userName: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
  amount?: number;
  error?: string;
}

export interface WebhookPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  failed_at: number | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: {
    eventId: string;
    userId: string;
    registrationId: string;
  };
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_reason: string | null;
  error_step: string | null;
  error_field: string | null;
  acquirer_data: {
    auth_code: string | null;
  };
  created_at: number;
}

export interface WebhookEvent {
  id: string;
  entity: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: WebhookPayment;
    };
  };
  created_at: number;
}