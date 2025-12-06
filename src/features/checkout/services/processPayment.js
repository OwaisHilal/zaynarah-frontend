// src/features/checkout/services/processPayment.js

// Stripe
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'); // use your Stripe test key

export async function processStripePayment(order) {
  const stripe = await stripePromise;

  // Mock line items for Stripe Checkout
  const lineItems = order.cartItems.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: { name: item.title || 'Product' },
      unit_amount: (item.price || 0) * 100, // in paise
    },
    quantity: item.qty || 1,
  }));

  // Redirect to Stripe Checkout in test mode
  const { error } = await stripe.redirectToCheckout({
    lineItems,
    mode: 'payment',
    successUrl: window.location.href + '?success=true',
    cancelUrl: window.location.href + '?canceled=true',
  });

  if (error) {
    console.error('Stripe error:', error);
    alert('Stripe payment failed');
  }
}

// Razorpay
export async function processRazorpayPayment(order) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      alert('Razorpay script not loaded!');
      reject('Razorpay not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_XXXXXXXXXXXXXXXX', // your Razorpay test key
      amount: (order.totalAmount || 0) * 100, // in paise
      currency: 'INR',
      name: 'Zaynarah Store',
      description: 'Test Payment',
      order_id: 'order_' + order.id,
      handler: function (response) {
        console.log('Razorpay success:', response);
        alert('Payment successful!');
        resolve(response);
      },
      modal: {
        ondismiss: function () {
          alert('Payment cancelled.');
          reject('Payment cancelled');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
