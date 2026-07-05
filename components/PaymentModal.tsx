'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PaymentModalProps {
  eventId: string;
  userId: string;
  registrationId: string;
  amount: number;
  eventName: string;
  userName: string;
  userEmail: string;
  onClose?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentModal({
  eventId,
  userId,
  registrationId,
  amount,
  eventName,
  userName,
  userEmail,
  onClose,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const orderResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId,
          registrationId,
          amount,
          email: userEmail,
          phoneNumber: '9999999999',
          userName,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert(`Error: ${orderData.message}`);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'ACE Club',
        description: `Payment for ${eventName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert('Success! Payment verified. Registration confirmed!');
            setTimeout(() => {
              onClose?.();
              window.location.reload();
            }, 2000);
          } else {
            alert(`Verification Failed: ${verifyData.message}`);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded">
            <p className="text-sm text-muted-foreground">Event</p>
            <p className="font-semibold text-foreground">{eventName}</p>
          </div>

          <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold text-primary">₹{amount}</p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? 'Processing...' : `Pay ₹${amount}`}
          </Button>

          <p className="text-xs text-gray-500 text-center">Secure payment via Razorpay</p>
        </div>
      </div>
    </div>
  );
}