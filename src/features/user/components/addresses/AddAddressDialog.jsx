//src/features/user/components/addresses/AddAddressDialog.jsx

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

export default function AddAddressDialog({ open, onClose, onSave }) {
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
    isDefault: false,
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.postalCode
    )
      return;

    await onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Address
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Full Name *</Label>
            <Input
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
            />
          </div>

          <div>
            <Label>Phone *</Label>
            <Input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Address Line 1 *</Label>
            <Input
              value={form.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Address Line 2</Label>
            <Input
              value={form.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
            />
          </div>

          <div>
            <Label>City *</Label>
            <Input
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>

          <div>
            <Label>State *</Label>
            <Input
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            />
          </div>

          <div>
            <Label>Postal Code *</Label>
            <Input
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
            />
          </div>

          <div>
            <Label>Country</Label>
            <Input
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <Checkbox
              checked={form.isDefault}
              onCheckedChange={(v) => update('isDefault', v)}
            />
            <span className="text-sm">Set as default address</span>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            style={{
              background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
              color: '#fff',
            }}
          >
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
