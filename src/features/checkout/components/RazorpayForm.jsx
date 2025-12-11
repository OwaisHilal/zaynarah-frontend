// src/features/checkout/components/RazorpayForm.jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

export default function RazorpayForm({ paymentDetails, setPaymentDetails }) {
  const [name, setName] = useState(paymentDetails?.name || '');
  const [phone, setPhone] = useState(paymentDetails?.phone || '');
  const [errors, setErrors] = useState({ name: '', phone: '' });

  useEffect(() => {
    setPaymentDetails({ name, phone });
  }, [name, phone, setPaymentDetails]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setErrors((prev) => ({ ...prev, phone: '' }));
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Your full name"
          value={name}
          onChange={handleNameChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          placeholder="+91 9876543210"
          value={phone}
          onChange={handlePhoneChange}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>
    </div>
  );
}
