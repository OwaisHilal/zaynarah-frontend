// src/features/checkout/components/CheckoutReview.jsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function CheckoutReview({ checkout }) {
  const order = checkout.orderData;

  if (!order) {
    return (
      <p className="text-center text-gray-500 text-sm">
        No order data found. Complete previous steps.
      </p>
    );
  }

  const {
    cart = [],
    cartTotal = {},
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails,
  } = order;

  return (
    <div className="space-y-6">
      {/* SHIPPING ADDRESS */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold">Shipping Address</h2>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-1">
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && (
            <p>{shippingAddress.addressLine2}</p>
          )}
          <p>
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p>Phone: {shippingAddress.phone}</p>
        </CardContent>
      </Card>

      {/* BILLING ADDRESS */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold">Billing Address</h2>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-1">
          <p>{billingAddress.fullName}</p>
          <p>{billingAddress.addressLine1}</p>
          {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
          <p>
            {billingAddress.city}, {billingAddress.state}{' '}
            {billingAddress.postalCode}
          </p>
          <p>{billingAddress.country}</p>
          <p>Phone: {billingAddress.phone}</p>
        </CardContent>
      </Card>

      {/* SHIPPING METHOD */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold">Shipping Method</h2>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {shippingMethod?.label} — {shippingMethod?.deliveryEstimate}
        </CardContent>
      </Card>

      {/* PAYMENT METHOD */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold">Payment Method</h2>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          <p className="capitalize">{paymentMethod}</p>

          {paymentMethod === 'stripe' && (
            <p className="text-xs mt-1 text-gray-500">
              Stripe Checkout — Email: <b>{paymentDetails?.email}</b>
            </p>
          )}

          {paymentMethod === 'razorpay' && (
            <p className="text-xs mt-1 text-gray-500">
              Razorpay — {paymentDetails?.name}, {paymentDetails?.phone}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ORDER SUMMARY */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold">Order Summary</h2>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="space-y-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.title} × {item.qty}
                </span>
                <span className="font-semibold text-rose-600">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200" />

          <Row label="Items Total" value={formatCurrency(cartTotal.items)} />
          <Row label="Shipping" value={formatCurrency(cartTotal.shipping)} />
          <Row label="Tax" value={formatCurrency(cartTotal.tax)} />

          <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t">
            <span>Grand Total</span>
            <span>{formatCurrency(cartTotal.grand)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
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
