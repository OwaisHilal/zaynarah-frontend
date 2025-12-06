// src/features/user/components/UserAddresses.jsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Dummy fetch function (replace with real API)
const fetchUserAddresses = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return [
    { id: 1, label: 'Home', details: '123 Kashmir Lane, Srinagar, India' },
    { id: 2, label: 'Office', details: '456 Business St, Delhi, India' },
  ];
};

export default function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newDetails, setNewDetails] = useState('');

  useEffect(() => {
    fetchUserAddresses().then((data) => {
      setAddresses(data);
      setLoading(false);
    });
  }, []);

  const handleAddAddress = () => {
    if (!newLabel || !newDetails) return;
    const newAddress = { id: Date.now(), label: newLabel, details: newDetails };
    setAddresses((prev) => [...prev, newAddress]);
    setNewLabel('');
    setNewDetails('');
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading addresses...</p>;

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Saved Addresses</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold">{address.label}</p>
              <p className="text-gray-500 text-sm">{address.details}</p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(address.id)}
            >
              Delete
            </Button>
          </div>
        ))}

        {/* Add New Address */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Input
            placeholder="Label (Home, Office...)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Input
            placeholder="Address details"
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
          />
          <Button onClick={handleAddAddress}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
