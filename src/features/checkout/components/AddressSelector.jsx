// src/features/checkout/components/AddressSelector.jsx
import { useState } from 'react';
import AddAddressForm from './AddAddressForm';
import { Card, CardContent } from '@/components/ui/card';

export default function AddressSelector({
  selectedAddress,
  setSelectedAddress,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([]); // replace with API or user store

  const handleAddAddress = (newAddress) => {
    const newAddr = { id: Date.now(), ...newAddress };
    setAddresses([...addresses, newAddr]);
    setSelectedAddress(newAddr);
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {addresses.length ? (
        addresses.map((addr) => (
          <Card
            key={addr.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAddress?.id === addr.id ? 'border-rose-600 border-2' : ''
            }`}
            onClick={() => setSelectedAddress(addr)}
          >
            <CardContent>
              <p className="font-semibold text-gray-800">
                {addr.name || 'Unnamed Address'}
              </p>
              <p className="text-sm text-gray-500">
                {addr.details || 'No details provided'}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No saved addresses yet.</p>
      )}

      {showAddForm ? (
        <AddAddressForm
          onAdd={handleAddAddress}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="text-rose-600 mt-2 underline hover:text-rose-700 self-start"
        >
          + Add New Address
        </button>
      )}
    </div>
  );
}
