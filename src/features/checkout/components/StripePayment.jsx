// src/features/checkout/components/StripePayment.jsx
import axios from 'axios';

export default async function StripePayment(orderId) {
  try {
    const res = await axios.post('/api/payments/stripe/checkout-session', {
      orderId,
    });
    const { sessionId, publishableKey } = res.data;

    const stripe = window.Stripe(publishableKey);
    await stripe.redirectToCheckout({ sessionId });
  } catch (err) {
    console.error('Stripe payment error:', err);
    alert('Stripe payment failed. Please try again.');
  }
}
