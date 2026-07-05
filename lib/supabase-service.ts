// lib/supabase-service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function savePayment(paymentData: {
  registrationId: string;
  eventId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  paymentDate?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('Payment')
      .insert([paymentData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Save Payment Error:', error);
    throw error;
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  razorpayPaymentId?: string,
  razorpaySignature?: string
) {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }

    if (razorpaySignature) {
      updateData.razorpaySignature = razorpaySignature;
    }

    if (status === 'completed') {
      updateData.paymentDate = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('Payment')
      .update(updateData)
      .eq('id', paymentId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Update Payment Status Error:', error);
    throw error;
  }
}

export async function updateRegistrationPaymentStatus(
  registrationId: string,
  paymentId: string,
  paymentStatus: 'pending' | 'completed' | 'failed'
) {
  try {
    const { data, error } = await supabase
      .from('Registration')
      .update({
        paymentId,
        paymentStatus,
      })
      .eq('id', registrationId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Update Registration Payment Status Error:', error);
    throw error;
  }
}

export async function getPaymentByRazorpayId(razorpayPaymentId: string) {
  try {
    const { data, error } = await supabase
      .from('Payment')
      .select('*')
      .eq('razorpayPaymentId', razorpayPaymentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Get Payment Error:', error);
    return null;
  }
}

export async function getRegistration(registrationId: string) {
  try {
    const { data, error } = await supabase
      .from('Registration')
      .select('*, Event(*), UserProfile(*)')
      .eq('id', registrationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get Registration Error:', error);
    throw error;
  }
}

export async function getEvent(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('Event')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get Event Error:', error);
    throw error;
  }
}

export async function createRefundRecord(refundData: {
  paymentId: string;
  refundAmount: number;
  refundReason: string;
  razorpayRefundId?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('PaymentRefund')
      .insert([refundData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Create Refund Record Error:', error);
    throw error;
  }
}