import axios from 'axios';

// Replace with your backend URL
const API_BASE = 'http://localhost:5000/api';

export async function createOrder({ address }) {
  const response = await axios.post(`${API_BASE}/orders`, { address });
  return response.data; // should include orderId, amount, currency
}

export async function processStripePayment(order) {
  const { orderId, amount, currency } = order;

  const stripe = window.Stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY');

  // Call backend to create Stripe session
  const sessionRes = await axios.post(`${API_BASE}/payments/stripe`, {
    orderId,
  });

  const { id: sessionId } = sessionRes.data;

  await stripe.redirectToCheckout({ sessionId });
}

export async function processRazorpayPayment(order) {
  const { orderId, amount, currency } = order;

  // Call backend to create Razorpay order
  const razorRes = await axios.post(`${API_BASE}/payments/razorpay`, {
    orderId,
  });
  const { id, key } = razorRes.data;

  const options = {
    key, // Razorpay key
    amount: amount * 100, // in paise
    currency,
    order_id: id,
    handler: function (response) {
      alert('Payment Successful: ' + response.razorpay_payment_id);
    },
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com',
      contact: '9999999999',
    },
    theme: {
      color: '#3399cc',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
