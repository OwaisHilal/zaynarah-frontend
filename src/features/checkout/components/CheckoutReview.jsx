import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCheckoutStore } from '../store/checkoutStore';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function CheckoutReview() {
  const {
    orderData,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
  } = useCheckoutStore();

  if (!orderData)
    return <p className="text-sm text-gray-500">No order data.</p>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Review Order</h2>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <b>Shipping:</b> {shippingAddress?.fullName}
        </p>
        <p>
          <b>Billing:</b> {billingAddress?.fullName}
        </p>
        <p>
          <b>Method:</b> {shippingMethod?.label}
        </p>
        <p>
          <b>Payment:</b> {paymentMethod}
        </p>
        <p>
          <b>Total:</b> {formatCurrency(orderData.total)}
        </p>
      </CardContent>
    </Card>
  );
}
