// src/features/checkout/components/CheckoutPaymentForm.jsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentOptions from './PaymentOptions';

export default function CheckoutPaymentForm({ checkout }) {
  const [selectedPayment, setSelectedPayment] = useState(
    checkout.orderDraft.paymentMethod || ''
  );

  const [details, setDetails] = useState(
    checkout.orderDraft.paymentDetails || {}
  );

  // Sync changes to checkout.orderDraft
  useEffect(() => {
    checkout.updatePaymentMethod(selectedPayment);
    checkout.updatePaymentDetails(details);
  }, [selectedPayment, details]);

  const handleDetailChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* PAYMENT METHOD OPTIONS */}
      {/* ---------------------------------------------------- */}
      <PaymentOptions
        selectedPayment={selectedPayment}
        setSelectedPayment={(method) => {
          setSelectedPayment(method);
          setDetails({}); // reset details when switching
        }}
      />

      {/* ---------------------------------------------------- */}
      {/* PAYMENT DETAILS FORM */}
      {/* ---------------------------------------------------- */}
      {selectedPayment === 'stripe' && (
        <div className="mt-4 space-y-3 p-4 border rounded-lg">
          <Label>Email</Label>
          <Input
            placeholder="email@example.com"
            value={details.email || ''}
            onChange={(e) => handleDetailChange('email', e.target.value)}
          />

          <Label>Card Number</Label>
          <Input
            placeholder="4242 4242 4242 4242"
            value={details.cardNumber || ''}
            onChange={(e) => handleDetailChange('cardNumber', e.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Expiry</Label>
              <Input
                placeholder="MM/YY"
                value={details.expiry || ''}
                onChange={(e) => handleDetailChange('expiry', e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Label>CVC</Label>
              <Input
                placeholder="123"
                value={details.cvc || ''}
                onChange={(e) => handleDetailChange('cvc', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedPayment === 'razorpay' && (
        <div className="mt-4 space-y-3 p-4 border rounded-lg">
          <Label>Full Name</Label>
          <Input
            placeholder="John Doe"
            value={details.name || ''}
            onChange={(e) => handleDetailChange('name', e.target.value)}
          />

          <Label>Phone Number</Label>
          <Input
            placeholder="+91 9876543210"
            value={details.phone || ''}
            onChange={(e) => handleDetailChange('phone', e.target.value)}
          />

          <Label>UPI ID (optional)</Label>
          <Input
            placeholder="example@upi"
            value={details.upiId || ''}
            onChange={(e) => handleDetailChange('upiId', e.target.value)}
          />

          <p className="text-sm text-gray-500 mt-1">
            Or enter card details below if not using UPI
          </p>

          <Label>Card Number</Label>
          <Input
            placeholder="4242 4242 4242 4242"
            value={details.cardNumber || ''}
            onChange={(e) => handleDetailChange('cardNumber', e.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Expiry</Label>
              <Input
                placeholder="MM/YY"
                value={details.expiry || ''}
                onChange={(e) => handleDetailChange('expiry', e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Label>CVC</Label>
              <Input
                placeholder="123"
                value={details.cvc || ''}
                onChange={(e) => handleDetailChange('cvc', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {!selectedPayment && (
        <p className="text-sm text-gray-500 mt-2">
          Please select a payment method to continue.
        </p>
      )}
    </div>
  );
}
