// src/features/checkout/hooks/usePaymentHandler.js
import { loadStripe } from '@stripe/stripe-js';

/**
 * ----------------------------------------------------
 * STRIPE PAYMENT HANDLER
 * ----------------------------------------------------
 */
export async function startStripePayment({ publishableKey, sessionId }) {
  try {
    if (!publishableKey || !sessionId) {
      throw new Error('Stripe session data missing.');
    }

    const stripe = await loadStripe(publishableKey);
    if (!stripe) throw new Error('Stripe failed to initialize.');

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result?.error) {
      throw new Error(result.error.message || 'Stripe redirect failed.');
    }

    return {
      success: true,
      gateway: 'stripe',
      sessionId,
    };
  } catch (err) {
    console.error('Stripe Payment Error:', err);
    throw err;
  }
}

/**
 * ----------------------------------------------------
 * RAZORPAY PAYMENT HANDLER
 * ----------------------------------------------------
 */
export function startRazorpayPayment({
  key,
  amount,
  currency,
  orderId,
  name = 'Zaynarah Store',
  description = 'Order Payment',
  onSuccess,
  onCancel,
}) {
  return new Promise((resolve, reject) => {
    try {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK missing.'));
        return;
      }

      if (!key || !amount || !currency || !orderId) {
        reject(new Error('Razorpay payment data missing.'));
        return;
      }

      const options = {
        key,
        amount,
        currency,
        name,
        description,
        order_id: orderId,

        handler: function (response) {
          if (onSuccess) onSuccess(response);
          resolve({
            success: true,
            gateway: 'razorpay',
            orderId,
            payment: response,
          });
        },

        modal: {
          ondismiss: function () {
            if (onCancel) onCancel();
            reject(new Error('Payment cancelled by user.'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Razorpay Payment Error:', err);
      reject(err);
    }
  });
}

/**
 * ----------------------------------------------------
 * GENERIC PAYMENT ROUTER
 * SDK-level gateway switcher
 * ----------------------------------------------------
 */
export async function startPayment(gateway, data) {
  switch (gateway) {
    case 'stripe':
      return await startStripePayment({
        publishableKey: data.publishableKey,
        sessionId: data.sessionId,
      });

    case 'razorpay':
      return await startRazorpayPayment({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        orderId: data.orderId,
        onSuccess: data.onSuccess,
        onCancel: data.onCancel,
      });

    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
}
