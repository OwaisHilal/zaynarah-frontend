// src/features/checkout/components/AddAddressForm.jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AddAddressForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !details) return;
    onAdd({ name, details });
    setName('');
    setDetails('');
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-rose-600">Add New Address</h3>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="address-name">Address Name</Label>
            <Input
              id="address-name"
              placeholder="Home / Office"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="address-details">Address Details</Label>
            <Input
              id="address-details"
              placeholder="Street, City, ZIP"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
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
