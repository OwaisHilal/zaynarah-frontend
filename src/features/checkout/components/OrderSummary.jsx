// src/features/checkout/components/OrderSummary.jsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart } from '../hooks/CartContext';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function OrderSummary({ checkout }) {
  const { cart } = useCart() || {};

  const safeCart = Array.isArray(cart) ? cart : [];

  // Compute subtotal
  const subtotal = safeCart.reduce((sum, item) => {
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

      <CardContent className="space-y-4">
        {/* Products */}
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
                {formatCurrency(price * qty)}
              </span>
            </div>
          );
        })}

        <hr className="border-gray-200" />

        {/* Subtotal */}
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {/* Shipping Method */}
        {checkout.shippingMethod && (
          <div className="flex justify-between text-gray-700">
            <span>Shipping ({checkout.shippingMethod.name || 'Standard'})</span>
            <span>{formatCurrency(checkout.shippingMethod.price || 0)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-bold text-lg text-gray-800 mt-2">
          <span>Total</span>
          <span>
            {formatCurrency(subtotal + (checkout.shippingMethod?.price || 0))}
          </span>
        </div>

        {/* Shipping & Billing */}
        {checkout.shippingAddress && (
          <div className="mt-3 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Shipping:</span>{' '}
              {checkout.shippingAddress.fullName},{' '}
              {checkout.shippingAddress.address},{' '}
              {checkout.shippingAddress.city}, {checkout.shippingAddress.state},{' '}
              {checkout.shippingAddress.zip}
            </p>
          </div>
        )}

        {checkout.billingAddress && (
          <div className="mt-1 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Billing:</span>{' '}
              {checkout.billingAddress.fullName},{' '}
              {checkout.billingAddress.address}, {checkout.billingAddress.city},{' '}
              {checkout.billingAddress.state}, {checkout.billingAddress.zip}
            </p>
          </div>
        )}

        {/* Payment Method */}
        {checkout.paymentMethod && (
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Payment:</span>{' '}
              {checkout.paymentMethod}{' '}
              {checkout.paymentDetails?.email &&
                `(${checkout.paymentDetails.email})`}
              {checkout.paymentDetails?.name &&
                `(${checkout.paymentDetails.name})`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
