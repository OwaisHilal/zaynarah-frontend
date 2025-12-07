// src/features/checkout/components/CartSummary.jsx
import { useCartStore } from '../../cart/hooks/cartStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CartSummary() {
  const cart = useCartStore((state) => state.cart) || [];
  const total = cart.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-rose-600">Cart Summary</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        {cart.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>
              {item.title} x {item.qty}
            </span>
            <span>₹{(item.price || 0) * (item.qty || 0)}</span>
          </div>
        ))}
        <hr className="border-gray-200 my-2" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
