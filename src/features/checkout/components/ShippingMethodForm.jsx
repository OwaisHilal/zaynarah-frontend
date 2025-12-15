import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function ShippingMethodForm({
  shippingMethods = [],
  shippingMethod,
  setShippingMethod,
  loading,
}) {
  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (!shippingMethods.length)
    return <p className="text-sm text-gray-500">No shipping options.</p>;

  return (
    <div className="grid gap-3">
      {shippingMethods.map((method) => {
        const id = method._id || method.id;
        const isSelected = shippingMethod?._id === id;

        return (
          <Card
            key={id}
            onClick={() => setShippingMethod(method)}
            className={cn(
              'cursor-pointer',
              isSelected && 'border-2 border-rose-600'
            )}
          >
            <CardContent className="flex justify-between p-4">
              <div>
                <p className="font-semibold">{method.label}</p>
                <p className="text-sm text-gray-500">
                  {method.deliveryEstimate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-600 font-semibold">
                  {formatCurrency(method.cost)}
                </span>
                {isSelected && <Check className="text-rose-600" />}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
