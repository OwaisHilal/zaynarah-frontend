// src/features/checkout/components/CheckoutNavigation.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '../utils/checkoutHelpers';
import { useCart } from '../../cart/context/CartContext';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onPlaceOrder,
  checkout,
}) {
  const nextDisabled = checkout.isNextDisabled
    ? checkout.isNextDisabled(currentStep)
    : false;

  const { cart } = useCart() || {};
  const safeCart = Array.isArray(cart) ? cart : [];

  const subtotal = safeCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  const shippingCost =
    checkout.shippingMethod?.cost ||
    checkout.orderDraft?.shippingMethod?.cost ||
    0;

  const grandTotal = subtotal + shippingCost;

  const REVIEW_STEP = 5;
  const PAYMENT_DETAILS_STEP = 4;

  const renderMiniSummary = () => (
    <Card className="mb-4 shadow-sm border border-gray-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-rose-600">Order Summary</h2>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700">
        {safeCart.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-gray-700"
          >
            <span>
              {item.title} × {item.qty}
            </span>
            <strong>{formatCurrency(item.price * item.qty)}</strong>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between font-semibold">
            <span>Shipping</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-6">
      {/* Show mini summary on payment details step */}
      {currentStep === PAYMENT_DETAILS_STEP && renderMiniSummary()}

      <div className="flex justify-between gap-4">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < REVIEW_STEP ? (
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            disabled={nextDisabled || checkout.loading}
            onClick={onNext}
          >
            {checkout.loading ? 'Processing…' : 'Next'}
          </Button>
        ) : (
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            disabled={checkout.loading}
            onClick={onPlaceOrder}
          >
            {checkout.loading ? 'Processing…' : 'Place Order'}
          </Button>
        )}
      </div>
    </div>
  );
}
