// src/features/checkout/components/AddressSelector.jsx
import { useEffect, useState } from 'react';
import AddAddressForm from './AddAddressForm';
import { Card, CardContent } from '@/components/ui/card';
import { getAddresses, addAddress } from '../../user/services/userApi';

export default function AddressSelector({
  selectedAddress,
  setSelectedAddress,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =============================
      FETCH SAVED ADDRESSES
  ============================= */
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data || []);

        // Auto-select the first address if none selected
        if (data?.length && !selectedAddress) {
          setSelectedAddress(data[0]);
        }
      } catch (err) {
        console.error('Failed to load addresses', err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  /* =============================
      ADD NEW ADDRESS (API)
  ============================= */
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
    return <p className="text-gray-500 text-sm">Loading addresses...</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Saved addresses */}
      {addresses.length ? (
        addresses.map((addr) => (
          <Card
            key={addr._id}
            className={`cursor-pointer transition-all hover:shadow-md p-0 ${
              selectedAddress?._id === addr._id
                ? 'border-2 border-rose-600'
                : ''
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
