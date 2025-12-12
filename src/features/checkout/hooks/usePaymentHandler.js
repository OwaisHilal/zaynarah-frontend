import { loadStripe } from '@stripe/stripe-js';

/**
 * Normalizes any backend Stripe response into:
 *   { publishableKey, sessionId }
 */
function normalizeStripeSession(data) {
  return {
    publishableKey:
      data?.publishableKey ||
      data?.publishable_key ||
      data?.publishable ||
      null,

    sessionId: data?.sessionId || data?.id || data?.checkoutSessionId || null,
  };
}

/**
 * STRIPE
 */
export async function startStripePayment(session) {
  const normalized = normalizeStripeSession(session);

  if (!normalized.publishableKey || !normalized.sessionId) {
    console.error('Stripe session received:', session);
    throw new Error('Stripe Checkout session is invalid.');
  }

  const stripe = await loadStripe(normalized.publishableKey);
  if (!stripe) throw new Error('Stripe failed to initialize.');

  const result = await stripe.redirectToCheckout({
    sessionId: normalized.sessionId,
  });

  if (result?.error)
    throw new Error(result.error.message || 'Stripe redirect failed.');

  return {
    success: true,
    gateway: 'stripe',
    sessionId: normalized.sessionId,
  };
}

/**
 * Normalizes Razorpay backend response into:
 *   { key, amount, currency, orderId }
 */
function normalizeRazorpayOrder(data) {
  return {
    key: data?.key || data?.keyId || data?.key_id || null,
    amount: data?.amount || null,
    currency: data?.currency || 'INR',
    orderId: data?.orderId || data?.id || data?.order_id || null,
  };
}

/**
 * RAZORPAY
 */
export function startRazorpayPayment(data) {
  return new Promise((resolve, reject) => {
    const normalized = normalizeRazorpayOrder(data);

    if (!window.Razorpay) return reject(new Error('Razorpay SDK not loaded.'));

    if (!normalized.key || !normalized.amount || !normalized.orderId) {
      console.error('Razorpay order received:', data);
      return reject(new Error('Razorpay order is missing required fields.'));
    }

    const options = {
      key: normalized.key,
      amount: normalized.amount,
      currency: normalized.currency,
      order_id: normalized.orderId,

      name: 'Zaynarah Store',
      description: 'Order Payment',

      handler(response) {
        resolve({
          success: true,
          gateway: 'razorpay',
          orderId: normalized.orderId,
          payment: response,
        });
      },

      modal: {
        ondismiss() {
          reject(new Error('Payment cancelled by user.'));
        },
      },
    };

    try {
      const rp = new window.Razorpay(options);
      rp.open();
    } catch (err) {
      console.error('Razorpay initialization failure:', err);
      reject(new Error('Failed to initialize Razorpay.'));
    }
  });
}

/**
 * GENERIC GATEWAY ROUTER
 */
export async function startPayment(gateway, data) {
  switch (gateway) {
    case 'stripe':
      return await startStripePayment(data);

    case 'razorpay':
      return await startRazorpayPayment(data);

    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
}
