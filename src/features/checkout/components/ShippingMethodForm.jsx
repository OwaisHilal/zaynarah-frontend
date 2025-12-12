// src/features/checkout/components/ShippingMethodForm.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '../utils/checkoutHelpers';
import { getShippingMethods } from '../services/useCheckoutApi';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShippingMethodForm({
  shippingMethod,
  setShippingMethod,
  shippingAddress,
}) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shippingAddress) {
      setMethods([]);
      return;
    }

    let mounted = true;
    const fetchMethods = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getShippingMethods(shippingAddress);
        if (mounted) setMethods(data || []);
      } catch (err) {
        console.error('Failed to fetch shipping methods:', err);
        if (mounted)
          setError('Unable to load shipping methods. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMethods();
    return () => (mounted = false);
  }, [shippingAddress]);

  if (!shippingAddress)
    return (
      <p className="text-gray-500 text-sm">Select a shipping address first.</p>
    );
  if (loading)
    return <p className="text-gray-500 text-sm">Loading shipping options...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!methods.length)
    return (
      <p className="text-gray-500 text-sm">
        No shipping options available for this address.
      </p>
    );

  return (
    <RadioGroup
      value={shippingMethod?._id || ''}
      onValueChange={(val) => {
        const selected = methods.find(
          (m) => (m._id || m.id || m.serviceId) === val
        );
        setShippingMethod(selected);
      }}
      className="grid grid-cols-1 gap-3"
    >
      {methods.map((method) => {
        const id =
          method._id ||
          method.id ||
          method.serviceId ||
          `${method.label}-${method.cost}`;
        const isSelected =
          shippingMethod?._id === id || shippingMethod?.id === id;
        return (
          <Card
            key={id}
            className={cn(
              'cursor-pointer border transition-all p-0',
              isSelected
                ? 'border-2 border-rose-600 shadow-sm'
                : 'border-gray-200 hover:shadow'
            )}
            onClick={() => setShippingMethod(method)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border',
                    isSelected
                      ? 'bg-rose-600 border-rose-600'
                      : 'bg-white border-gray-300'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {method.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {method.deliveryEstimate ||
                      method.eta ||
                      method.estimate ||
                      ''}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-rose-600">
                  {formatCurrency(method.cost || 0)}
                </div>
                {method.carrier && (
                  <div className="text-xs text-gray-500">{method.carrier}</div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </RadioGroup>
  );
}
