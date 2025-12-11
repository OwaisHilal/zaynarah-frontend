// src/features/checkout/components/StripeCardForm.jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

export default function StripeCardForm({ paymentDetails, setPaymentDetails }) {
  const [email, setEmail] = useState(paymentDetails?.email || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setPaymentDetails({ email });
  }, [email, setPaymentDetails]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  return (
    <div className="mt-4 space-y-2">
      <Label>Email</Label>
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={handleChange}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
