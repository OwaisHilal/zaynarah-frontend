// src/features/checkout/components/BillingAddressForm.jsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCheckoutDomainStore } from '@/stores/checkout';

export default function BillingAddressForm() {
  const billingAddress = useCheckoutDomainStore((s) => s.billingAddress);
  const shippingAddress = useCheckoutDomainStore((s) => s.shippingAddress);
  const setBillingAddress = useCheckoutDomainStore((s) => s.setBillingAddress);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (billingAddress) setForm(billingAddress);
  }, [billingAddress]);

  useEffect(() => {
    if (sameAsShipping && shippingAddress) {
      setForm(shippingAddress);
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress, setBillingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.fullName) return 'Full name is required';
    if (!form.phone) return 'Phone number is required';
    if (!form.addressLine1) return 'Address Line 1 is required';
    if (!form.city) return 'City is required';
    if (!form.state) return 'State is required';
    if (!form.postalCode) return 'Postal code is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sameAsShipping) return;

    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError('');
    setLoading(true);
    try {
      setBillingAddress({ ...form });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-rose-600">Billing Address</h3>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Checkbox
            id="sameAsShipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setSameAsShipping(checked)}
          />
          <Label htmlFor="sameAsShipping" className="cursor-pointer">
            Same as Shipping Address
          </Label>
        </div>

        {!sameAsShipping && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <div className="flex flex-col gap-1">
              <Label>Full Name</Label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Email (optional)</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Address Line 1</Label>
              <Input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Address Line 2 (optional)</Label>
              <Input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>City</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>State</Label>
              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Postal Code</Label>
              <Input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Country</Label>
              <Input name="country" value={form.country} disabled />
            </div>

            <Button
              type="submit"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Billing Address'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
