// src/features/checkout/components/RazorpayForm.jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import BillingAddressForm from './BillingAddressForm';

export default function RazorpayForm({ paymentDetails, setPaymentDetails }) {
  const [form, setForm] = useState({
    name: paymentDetails?.name || '',
    phone: paymentDetails?.phone || '',
    upiId: paymentDetails?.upiId || '',
  });

  const [errors, setErrors] = useState({});
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);

  useEffect(() => {
    setPaymentDetails && setPaymentDetails(form);
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateField = (field, value) => {
    let error = '';
    if (field === 'name') {
      if (!value?.trim()) error = 'Name is required.';
      else if (value.length < 2) error = 'Name is too short.';
    }
    if (field === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!value) error = 'Phone number is required.';
      else if (!phoneRegex.test(value))
        error = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (field === 'upiId' && value) {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(value)) error = 'Invalid UPI ID format.';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => validateField('name', form.name)}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Label>Phone Number</Label>
        <Input
          placeholder="9876543210"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => validateField('phone', form.phone)}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div>
        <Label>UPI ID (optional)</Label>
        <Input
          placeholder="example@upi"
          value={form.upiId}
          onChange={(e) => handleChange('upiId', e.target.value)}
          onBlur={() => validateField('upiId', form.upiId)}
          className={errors.upiId ? 'border-red-500' : ''}
        />
        {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="diffBilling"
          checked={useDifferentBilling}
          onCheckedChange={(v) => setUseDifferentBilling(Boolean(v))}
        />
        <label htmlFor="diffBilling" className="cursor-pointer select-none">
          Use a different billing address
        </label>
      </div>

      {useDifferentBilling && (
        <div className="mt-2">
          <BillingAddressForm
            billingAddress={null}
            setBillingAddress={() => {}}
            shippingAddress={null}
          />
          <p className="text-xs text-gray-500 mt-2">
            Note: billing address entered here will be sent with the order
            payload if your frontend wires it up.
          </p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        If no UPI ID is entered, Razorpay will show available payment options
        (card, UPI, wallets) in the modal.
      </p>
    </div>
  );
}
