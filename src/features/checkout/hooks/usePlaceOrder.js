// src/features/checkout/hooks/usePlaceOrder.js
import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import {
  placeOrderAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
  verifyRazorpayPaymentAPI,
} from '../services/useCheckoutApi';

export default function usePlaceOrder(checkout) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------------------------------
  // VALIDATION (based on NEW production forms)
  // ----------------------------------------------------
  const validatePaymentDetails = useCallback(() => {
    const method = checkout.paymentMethod;
    const details = checkout.paymentDetails || {};

    if (method === 'stripe') {
      if (!details.email?.trim()) {
        throw new Error('Please enter your email for Stripe payment.');
      }
    }

    if (method === 'razorpay') {
      if (!details.name?.trim()) {
        throw new Error('Full name is required for Razorpay payment.');
      }
      if (!details.phone?.trim()) {
        throw new Error('Phone number is required for Razorpay payment.');
      }
    }
  }, [checkout.paymentMethod, checkout.paymentDetails]);

  // ----------------------------------------------------
  // STRIPE HANDLER
  // ----------------------------------------------------
  const handleStripe = useCallback(async (orderId) => {
    const session = await createStripeSessionAPI(orderId);
    if (!session?.publishableKey || !session?.sessionId) {
      throw new Error('Stripe session missing required fields.');
    }

    const stripe = await loadStripe(session.publishableKey);
    if (!stripe) throw new Error('Failed to load Stripe.');

    await stripe.redirectToCheckout({ sessionId: session.sessionId });
  }, []);

  // ----------------------------------------------------
  // RAZORPAY HANDLER
  // ----------------------------------------------------
  const handleRazorpay = useCallback(async (orderId) => {
    const payment = await createRazorpayOrderAPI(orderId);

    if (!payment?.key || !payment?.orderId) {
      throw new Error('Razorpay order missing required fields.');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Zaynarah Store',
        description: 'Order Payment',
        order_id: payment.orderId,

        handler: async (response) => {
          try {
            await verifyRazorpayPaymentAPI({
              orderId,
              ...response,
            });
            resolve(true);
          } catch (err) {
            reject(err);
          }
        },

        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        reject(new Error('Failed to initialize Razorpay'));
      }
    });
  }, []);

  // ----------------------------------------------------
  // GATEWAY ROUTER
  // ----------------------------------------------------
  const triggerGateway = useCallback(
    async (order) => {
      const method = order.paymentMethod;

      switch (method) {
        case 'stripe':
          return await handleStripe(order._id);

        case 'razorpay':
          return await handleRazorpay(order._id);

        default:
          throw new Error(`Unsupported payment method: ${method}`);
      }
    },
    [handleStripe, handleRazorpay]
  );

  // ----------------------------------------------------
  // MAIN OPERATION
  // ----------------------------------------------------
  const placeOrder = useCallback(
    async ({ cart, cartTotal }) => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Validate payment details
        validatePaymentDetails();

        // 2. Build checkout payload
        const payload = checkout.buildCheckoutPayload({ cart, cartTotal });

        // 3. Create order (Pending)
        const order = await placeOrderAPI(payload);
        checkout.setOrderData(order);

        // 4. Start correct payment flow
        await triggerGateway(order);

        return order;
      } catch (err) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          'Failed to place order.';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [checkout, validatePaymentDetails, triggerGateway]
  );

  return { placeOrder, isLoading, error };
}
