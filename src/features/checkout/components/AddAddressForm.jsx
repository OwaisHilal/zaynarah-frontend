// src/features/checkout/components/AddAddressForm.jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AddAddressForm({ onAdd, onCancel }) {
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName) return 'Full name is required';
    if (!form.phone) return 'Phone number is required';
    if (!form.addressLine1) return 'Address Line 1 is required';
    if (!form.city) return 'City is required';
    if (!form.state) return 'State is required';
    if (!form.postalCode) return 'Pincode is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError('');
    setLoading(true);

    // Prepare clean address object
    const newAddress = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country,
    };

    // send to parent to trigger backend save
    try {
      await onAdd(newAddress);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-rose-600">
          Add Shipping Address
        </h3>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <Label>Phone Number</Label>
            <Input
              name="phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label>Email (optional)</Label>
            <Input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Address Line 1 */}
          <div className="flex flex-col gap-1">
            <Label>Address Line 1</Label>
            <Input
              name="addressLine1"
              placeholder="Street / Apartment / House No."
              value={form.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address Line 2 */}
          <div className="flex flex-col gap-1">
            <Label>Address Line 2 (optional)</Label>
            <Input
              name="addressLine2"
              placeholder="Area / Landmark"
              value={form.addressLine2}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <Label>City</Label>
            <Input
              name="city"
              placeholder="Mumbai"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* State */}
          <div className="flex flex-col gap-1">
            <Label>State</Label>
            <Input
              name="state"
              placeholder="Maharashtra"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>

          {/* Postal Code */}
          <div className="flex flex-col gap-1">
            <Label>Pincode</Label>
            <Input
              name="postalCode"
              placeholder="400001"
              value={form.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1">
            <Label>Country</Label>
            <Input name="country" value={form.country} disabled />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Address'}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
