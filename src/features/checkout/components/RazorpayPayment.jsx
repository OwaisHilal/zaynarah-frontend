// src/features/checkout/components/RazorpayPayment.jsx
import axios from 'axios';

export default async function RazorpayPayment(orderId, onSuccess) {
  try {
    const res = await axios.post('/api/payments/razorpay/order', { orderId });
    const { paymentId, key, amount, currency } = res.data;

    const options = {
      key,
      amount,
      currency,
      order_id: paymentId,
      handler: async function (response) {
        // Verify payment signature on server
        await axios.post('/api/payments/razorpay/verify', {
          orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        if (onSuccess) onSuccess();
      },
      prefill: {
        name: 'Customer', // you can pass real user data here
        email: '', // optional
      },
      modal: {
        ondismiss: () => alert('Payment cancelled'),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('Razorpay payment error:', err);
    alert('Razorpay payment failed. Please try again.');
  }
}
