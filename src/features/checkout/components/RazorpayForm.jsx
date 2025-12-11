// src/features/checkout/components/RazorpayForm.jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RazorpayForm({ paymentDetails, setPaymentDetails }) {
  const [upiId, setUpiId] = useState(paymentDetails?.upiId || '');
  const [cardNumber, setCardNumber] = useState(
    paymentDetails?.cardNumber || ''
  );
  const [expiry, setExpiry] = useState(paymentDetails?.expiry || '');
  const [cvc, setCvc] = useState(paymentDetails?.cvc || '');

  const handleChange = () => {
    setPaymentDetails({ upiId, cardNumber, expiry, cvc });
  };

  return (
    <div className="mt-4 space-y-3">
      <Label>UPI ID</Label>
      <Input
        placeholder="example@upi"
        value={upiId}
        onChange={(e) => {
          setUpiId(e.target.value);
          handleChange();
        }}
      />

      <p className="text-sm text-gray-500">Or enter card details:</p>

      <Label>Card Number</Label>
      <Input
        placeholder="4242 4242 4242 4242"
        value={cardNumber}
        onChange={(e) => {
          setCardNumber(e.target.value);
          handleChange();
        }}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Expiry</Label>
          <Input
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => {
              setExpiry(e.target.value);
              handleChange();
            }}
          />
        </div>

        <div className="flex-1">
          <Label>CVC</Label>
          <Input
            placeholder="123"
            value={cvc}
            onChange={(e) => {
              setCvc(e.target.value);
              handleChange();
            }}
          />
        </div>
      </div>
    </div>
  );
}
