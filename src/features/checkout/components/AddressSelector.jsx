// src/features/checkout/components/AddressSelector.jsx

import { useEffect, useState } from 'react';
import AddAddressForm from './AddAddressForm';
import { Card, CardContent } from '@/components/ui/card';
import { getAddresses, addAddress } from '../../user/services/userApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressSelector({
  selectedAddress,
  setSelectedAddress,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data || []);

        if ((!selectedAddress || !selectedAddress._id) && data?.length > 0) {
          setSelectedAddress(data[0]);
        }
      } catch (err) {
        console.error('Failed to load addresses', err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [selectedAddress]);

  // ------------------------------------------------------------
  // ADD NEW ADDRESS
  // ------------------------------------------------------------
  const handleAddAddress = async (newAddress) => {
    try {
      const saved = await addAddress(newAddress);
      const updated = [...addresses, saved];

      setAddresses(updated);
      setSelectedAddress(saved);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add address', err);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-sm animate-pulse">
        Loading addresses...
      </p>
    );
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col gap-4">
      {/* Saved addresses list */}
      <AnimatePresence>
        {addresses.length ? (
          addresses.map((addr) => {
            const isSelected = selectedAddress?._id === addr._id;

            return (
              <motion.div
                key={addr._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Card
                  className={`relative cursor-pointer transition-all rounded-xl 
                    hover:shadow-lg bg-white
                    ${
                      isSelected
                        ? 'border-2 border-rose-600 shadow-md'
                        : 'border'
                    } 
                  `}
                  onClick={() => setSelectedAddress(addr)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) =>
                    e.key === 'Enter' ? setSelectedAddress(addr) : null
                  }
                >
                  {/* Selected badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                      Selected
                    </div>
                  )}

                  <CardContent className="p-4">
                    <p className="font-semibold text-gray-900 text-sm">
                      {addr.fullName}
                    </p>

                    <p className="text-sm text-gray-700 leading-tight">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>

                    <p className="text-sm text-gray-700 leading-tight">
                      {addr.city}, {addr.state} — {addr.postalCode}
                    </p>

                    <p className="text-sm text-gray-700">{addr.country}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      📞 {addr.phone}
                      {addr.email ? ` • ${addr.email}` : ''}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No saved addresses yet.</p>
        )}
      </AnimatePresence>

      {/* Add new address section */}
      {showAddForm ? (
        <AddAddressForm
          onAdd={handleAddAddress}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="text-sm font-medium text-rose-600 hover:text-rose-700
                     bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg 
                     self-start transition-all hover:bg-rose-100"
        >
          + Add New Address
        </button>
      )}
    </div>
  );
}
