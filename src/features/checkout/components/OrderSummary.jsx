// src/features/checkout/components/OrderSummary.jsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart } from '../hooks/CartContext';

export default function OrderSummary() {
  const { cart } = useCart() || {};

  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );

  if (!safeCart.length) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-rose-600">Order Summary</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center">
            Your cart is empty.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-rose-600">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {safeCart.map((item) => (
          <div
            key={item.id || item._id}
            className="flex justify-between text-gray-700"
          >
            <span>
              {item.title || 'Untitled Product'} × {item.qty || 0}
            </span>
            <span className="font-semibold text-rose-600">
              ₹
              {(
                (Number(item.price) || 0) * (Number(item.qty) || 0)
              ).toLocaleString()}
            </span>
          </div>
        ))}

        <hr className="my-3 border-gray-200" />

        <div className="flex justify-between font-bold text-lg text-gray-800">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
