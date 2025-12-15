import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart } from '../../cart/context/useCart';
import { useCheckoutStore } from '../store/checkoutStore';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function OrderSummary() {
  const { cart = [] } = useCart() || {};
  const { shippingMethod } = useCheckoutStore();

  const subtotal = cart.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.qty || 1),
    0
  );

  const shipping = shippingMethod?.cost || 0;
  const total = subtotal + shipping;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-rose-600">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.map((i) => (
          <div key={i.productId} className="flex justify-between">
            <span>
              {i.title} × {i.qty}
            </span>
            <span>{formatCurrency(i.price * i.qty)}</span>
          </div>
        ))}

        <hr />
        <Row label="Subtotal" value={subtotal} />
        <Row label="Shipping" value={shipping} />
        <Row label="Total" value={total} bold />
      </CardContent>
    </Card>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold' : ''}`}>
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
