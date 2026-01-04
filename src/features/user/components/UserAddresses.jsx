// frontend/src/features/user/components/UserAddresses.jsx
import { useEffect, useState } from 'react';
import { useUserStore } from '../hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddAddressDialog from './addresses/AddAddressDialog';

export default function UserAddresses() {
  const {
    addresses,
    fetchAddresses,
    addAddress,
    deleteAddress,
    updateAddress,
  } = useUserStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Saved addresses
          </h2>
          <p className="text-sm text-gray-600">
            Used for delivery and billing during checkout
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Add address</Button>
      </div>

      {!addresses.length && (
        <Card className="rounded-2xl border border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              You haven’t saved any addresses yet
            </p>
            <Button onClick={() => setOpen(true)}>
              Add your first address
            </Button>
          </CardContent>
        </Card>
      )}

      {defaultAddress && (
        <Card className="rounded-3xl shadow-xl border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Default address
            </CardTitle>
          </CardHeader>

          <CardContent className="flex items-start justify-between gap-6">
            <div>
              <p className="font-medium text-gray-900">
                {defaultAddress.fullName}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {defaultAddress.addressLine1}, {defaultAddress.city},{' '}
                {defaultAddress.state} – {defaultAddress.postalCode}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {defaultAddress.phone}
              </p>
              <p className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                {defaultAddress.type}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => deleteAddress(defaultAddress._id)}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      )}

      {otherAddresses.length > 0 && (
        <>
          <Separator />
          <div className="grid gap-4">
            {otherAddresses.map((a) => (
              <Card key={a._id} className="rounded-2xl border">
                <CardContent className="flex items-start justify-between gap-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{a.fullName}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {a.addressLine1}, {a.city}, {a.state} – {a.postalCode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{a.phone}</p>
                    <p className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {a.type}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAddress(a._id, { isDefault: true })}
                    >
                      Make default
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => deleteAddress(a._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AddAddressDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={async (data) => {
          await addAddress(data);
          setOpen(false);
        }}
      />
    </div>
  );
}
