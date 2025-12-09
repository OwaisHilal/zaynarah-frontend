// src/features/checkout/components/OrderSummary.jsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart } from '../hooks/CartContext';

export default function OrderSummary() {
  const { cart } = useCart() || {};

  // Always keep the cart safe
  const safeCart = Array.isArray(cart) ? cart : [];

  // Compute total price safely
  const total = safeCart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

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
        {safeCart.map((item) => {
          const price = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;

          return (
            <div
              key={item._id || item.id}
              className="flex justify-between text-gray-700"
            >
              <span>
                {item.title || 'Untitled Product'} × {qty}
              </span>

              <span className="font-semibold text-rose-600">
                ₹{(price * qty).toLocaleString()}
              </span>
            </div>
          );
        })}

        <hr className="my-3 border-gray-200" />

        <div className="flex justify-between font-bold text-lg text-gray-800">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
