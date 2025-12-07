// src/features/checkout/components/CheckoutForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddressSelector from './AddressSelector';
import { useCartStore } from '../../cart/hooks/cartStore';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutForm({ checkout }) {
  const cartItems = useCartStore((state) => state.cart) || [];
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // JWT for API calls

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  const handlePlaceOrder = async () => {
    setError('');

    if (!checkout.selectedAddress) {
      setError('Please select an address!');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty!');
      return;
    }

    checkout.setLoading(true);
    try {
      // 1️⃣ Create order via backend
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          address: checkout.selectedAddress,
          totalAmount,
        }),
      });
      const order = await orderRes.json();
      checkout.setOrderData(order);

      // 2️⃣ Process Payment
      if (checkout.paymentMethod === 'stripe') {
        const stripeRes = await fetch('/api/payments/stripe-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: order._id }),
        });
        const { sessionId, publishableKey } = await stripeRes.json();
        const stripe = await loadStripe(publishableKey);
        await stripe.redirectToCheckout({ sessionId });
      }

      if (checkout.paymentMethod === 'razorpay') {
        const razorRes = await fetch('/api/payments/razorpay-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: order._id }),
        });
        const data = await razorRes.json();

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'Zaynarah Store',
          description: 'Order Payment',
          order_id: data.id,
          handler: function (response) {
            alert('Payment Successful!');
            checkout.resetCheckout();
          },
          modal: {
            ondismiss: () => alert('Payment Cancelled'),
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      setError('Payment or order creation failed. Try again.');
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

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
