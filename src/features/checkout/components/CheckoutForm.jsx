import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddressSelector from './AddressSelector';
import { createOrder } from '../services/createOrder';
import {
  processStripePayment,
  processRazorpayPayment,
} from '../services/processPayment';
import { useCartStore } from '../../cart/hooks/cartStore';

export default function CheckoutForm({ checkout }) {
  const cartItems = useCartStore((state) => state.cart) || [];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (!checkout.selectedAddress) return alert('Please select an address!');
    if (!cartItems.length) return alert('Your cart is empty!');

    checkout.setLoading(true);
    try {
      const order = await createOrder({
        address: checkout.selectedAddress,
        cartItems,
        totalAmount,
      });

      checkout.setOrderData(order);

      if (checkout.paymentMethod === 'stripe')
        await processStripePayment(order);
      if (checkout.paymentMethod === 'razorpay')
        await processRazorpayPayment(order);
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again.');
    } finally {
      checkout.setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Delivery Address</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AddressSelector
          selectedAddress={checkout.selectedAddress}
          setSelectedAddress={checkout.setSelectedAddress}
        />

        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold">Total: ₹{totalAmount}</p>
          <Button
            onClick={handlePlaceOrder}
            disabled={checkout.loading || !cartItems.length}
          >
            {checkout.loading ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
