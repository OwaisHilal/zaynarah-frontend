import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import AddAddressForm from './AddAddressForm';
import { getAddresses, addAddress } from '../../user/services/userApi';
import { useCheckoutStore } from '../store/checkoutStore';

export default function AddressSelector() {
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getAddresses();
      setAddresses(data || []);
      if (!shippingAddress && data?.length) {
        setShippingAddress(data[0]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading addresses…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {addresses.map((addr) => {
          const isSelected = shippingAddress?._id === addr._id;
          return (
            <motion.div key={addr._id} layout>
              <Card
                onClick={() => setShippingAddress(addr)}
                className={`cursor-pointer ${
                  isSelected ? 'border-rose-600 border-2' : ''
                }`}
              >
                <CardContent className="p-4">
                  <p className="font-semibold">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {showAddForm ? (
        <AddAddressForm
          onAdd={async (a) => {
            const saved = await addAddress(a);
            setAddresses((p) => [...p, saved]);
            setShippingAddress(saved);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button onClick={() => setShowAddForm(true)}>+ Add Address</button>
      )}
    </div>
  );
}
