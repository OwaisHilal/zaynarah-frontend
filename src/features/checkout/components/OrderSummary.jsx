// src/features/checkout/components/OrderSummary.jsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart } from '../../cart/context/CartContext';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function OrderSummary({ checkout }) {
  const { cart } = useCart() || {};
  const safeCart = Array.isArray(cart) ? cart : [];

  // Subtotal
  const subtotal = safeCart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  const shippingCost = checkout.orderDraft?.cartTotal?.shipping || 0;
  const grandTotal = subtotal + shippingCost;

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-rose-600">Order Summary</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* EMPTY CART */}
        {!safeCart.length && (
          <p className="text-gray-500 text-sm text-center">
            Your cart is empty.
          </p>
        )}

        {/* ITEMS */}
        {safeCart.map((item) => {
          const price = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;

          return (
            <div
              key={item._id || item.id}
              className="flex justify-between text-gray-700"
            >
              <span>
                {item.title} × {qty}
              </span>
              <span className="font-semibold text-rose-600">
                {formatCurrency(price * qty)}
              </span>
            </div>
          );
        })}

        {safeCart.length > 0 && (
          <>
            <hr className="border-gray-200" />

            <Row label="Subtotal" value={formatCurrency(subtotal)} />

            {checkout.orderDraft?.shippingMethod && (
              <Row
                label={`Shipping (${checkout.orderDraft.shippingMethod.label})`}
                value={formatCurrency(shippingCost)}
              />
            )}

            <div className="flex justify-between font-bold text-lg text-gray-800 mt-2">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between font-semibold text-gray-800">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
