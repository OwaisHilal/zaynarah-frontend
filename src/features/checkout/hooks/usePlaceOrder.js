// src/features/checkout/hooks/usePlaceOrder.js
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export default function usePlaceOrder({ checkout }) {
  const [error, setError] = useState('');

  const placeOrder = async () => {
    setError('');

    if (!checkout.selectedAddress) {
      setError('Please select an address!');
      return;
    }

    checkout.setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // 1️⃣ Fetch cart
      const cartRes = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await cartRes.json();
      if (!cartData.items?.length) {
        setError('Your cart is empty!');
        return;
      }

      // 2️⃣ Create order
      const totalAmount = cartData.items.reduce(
        (sum, i) => sum + i.qty * i.price,
        0
      );
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartData.items,
          address: checkout.selectedAddress,
          totalAmount,
        }),
      });
      const order = await orderRes.json();
      checkout.setOrderData(order);

      // 3️⃣ Payment
      if (checkout.paymentMethod === 'stripe') {
        await handleStripePayment(order, token);
      } else if (checkout.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order, token);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      checkout.setLoading(false);
    }
  };

  const handleStripePayment = async (order, token) => {
    const stripeRes = await fetch('/api/payments/stripe/checkout-session', {
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
  };

  const handleRazorpayPayment = async (order, token) => {
    const razorRes = await fetch('/api/payments/razorpay/order', {
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
      handler: function () {
        alert('Payment Successful!');
        checkout.resetCheckout();
      },
      modal: { ondismiss: () => alert('Payment Cancelled') },
    };
    new window.Razorpay(options).open();
  };

  return { placeOrder, error, setError };
}
