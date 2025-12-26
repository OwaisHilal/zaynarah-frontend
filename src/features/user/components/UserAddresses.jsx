// src/features/user/components/UserAddresses.jsx
import { useEffect, useState } from 'react';
import { useUserStore } from '../hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddAddressDialog from './addresses/AddAddressDialog';

export default function UserAddresses() {
  const { addresses, fetchAddresses, addAddress, deleteAddress } =
    useUserStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
      <Card className="max-w-4xl mx-auto bg-white/95 shadow-2xl rounded-3xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Saved Addresses
          </CardTitle>
          <Button onClick={() => setOpen(true)}>+ Add New</Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {!addresses.length && (
            <p className="text-gray-500 text-sm">No saved addresses.</p>
          )}

          {addresses.map((a) => (
            <div
              key={a._id}
              className="flex justify-between items-start p-4 border rounded-xl"
            >
              <div>
                <p className="font-semibold">
                  {a.fullName}{' '}
                  {a.isDefault && (
                    <span className="ml-2 text-xs text-green-600">
                      (Default)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {a.addressLine1}, {a.city}, {a.state} – {a.postalCode}
                </p>
                <p className="text-sm text-gray-500">{a.phone}</p>
              </div>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteAddress(a._id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <AddAddressDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={async (data) => {
          await addAddress(data);
        }}
      />
    </>
  );
}
