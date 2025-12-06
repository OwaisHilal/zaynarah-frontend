import { useCartStore } from '../../cart/hooks/cartStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OrderSummary() {
  const cart = useCartStore((state) => state.cart) || [];
  const total = cart.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-rose-600">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-700">
            <span>
              {item.title} x {item.qty}
            </span>
            <span className="font-semibold text-rose-600">
              ₹{(item.price || 0) * (item.qty || 0)}
            </span>
          </div>
        ))}
        <hr className="my-3 border-gray-200" />
        <div className="flex justify-between font-bold text-lg text-gray-800">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
