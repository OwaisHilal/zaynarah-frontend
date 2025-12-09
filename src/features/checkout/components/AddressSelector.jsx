// src/features/checkout/components/AddressSelector.jsx
import { useEffect, useState } from 'react';
import AddAddressForm from './AddAddressForm';
import { Card, CardContent } from '@/components/ui/card';

export default function AddressSelector({
  selectedAddress,
  setSelectedAddress,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  // This will later be replaced by API call (userApi.getAddresses)
  const [addresses, setAddresses] = useState([]);

  // OPTIONAL: If you want to auto-select first address on load
  useEffect(() => {
    if (addresses.length && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  // When user adds new address
  const handleAddAddress = (newAddress) => {
    const formatted = {
      id: Date.now(), // temporary until backend provides ID
      ...newAddress,
    };

    const updated = [...addresses, formatted];
    setAddresses(updated);
    setSelectedAddress(formatted);
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Saved addresses */}
      {addresses.length ? (
        addresses.map((addr) => (
          <Card
            key={addr.id}
            className={`cursor-pointer transition-all hover:shadow-md p-0 ${
              selectedAddress?.id === addr.id ? 'border-2 border-rose-600' : ''
            }`}
            onClick={() => setSelectedAddress(addr)}
          >
            <CardContent className="p-4">
              <p className="font-semibold text-gray-900">{addr.fullName}</p>

              <p className="text-sm text-gray-700">
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}
              </p>

              <p className="text-sm text-gray-700">
                {addr.city}, {addr.state} — {addr.postalCode}
              </p>

              <p className="text-sm text-gray-700">{addr.country}</p>

              <p className="text-sm text-gray-500 mt-1">
                📞 {addr.phone}
                {addr.email ? ` • 📧 ${addr.email}` : ''}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No saved addresses yet.</p>
      )}

      {/* Add new address */}
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
