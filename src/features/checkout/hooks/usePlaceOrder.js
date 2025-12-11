// src/features/checkout/hooks/usePlaceOrder.js
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';

import {
  finalizeCheckoutAPI,
  createOrderDraftAPI,
  initPaymentAPI,
} from './useCheckoutApi';

export default function usePlaceOrder({ checkout }) {
  const queryClient = useQueryClient();

  // ----------------------------------------------------
  // PAYMENT HANDLERS
  // ----------------------------------------------------

  // Stripe Checkout Redirect
  const handleStripePayment = useCallback(async (payment) => {
    const stripe = await loadStripe(payment.publishableKey);
    if (!stripe) throw new Error('Stripe failed to load.');
    await stripe.redirectToCheckout({ sessionId: payment.sessionId });
  }, []);

  // Razorpay Popup Window
  const handleRazorpayPayment = useCallback(
    async (payment) => {
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Zaynarah Store',
        description: 'Order Payment',
        order_id: payment.orderId,
        handler: () => checkout.resetCheckout(),
        modal: { ondismiss: () => alert('Payment Cancelled') },
      };

      new window.Razorpay(options).open();
    },
    [checkout]
  );

  // Dynamic router for all future gateways
  const gatewayHandler = useCallback(
    async (payment, method) => {
      switch (method) {
        case 'stripe':
          return await handleStripePayment(payment);

        case 'razorpay':
          return await handleRazorpayPayment(payment);

        default:
          throw new Error(`Unsupported payment method: ${method}`);
      }
    },
    [handleStripePayment, handleRazorpayPayment]
  );

  // ----------------------------------------------------
  // MAIN PLACE ORDER MUTATION
  // ----------------------------------------------------
  const placeOrderMutation = useMutation(
    async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to checkout.');

      const {
        checkoutSessionId,
        shippingAddress,
        billingAddress,
        shippingMethod,
        paymentMethod,
      } = checkout;

      // 1️⃣ Finalize checkout (confirms totals & locks price)
      const checkoutSession = await finalizeCheckoutAPI({
        token,
        checkoutSessionId,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        shippingMethod,
      });

      if (!checkoutSession.totalAmount) {
        throw new Error('Failed to lock final price.');
      }

      // 2️⃣ Create draft order
      const order = await createOrderDraftAPI({
        token,
        checkoutSessionId: checkoutSession.checkoutSessionId,
        paymentGateway: paymentMethod,
      });

      checkout.setOrderData(order);

      // 3️⃣ Initialize selected payment gateway
      const payment = await initPaymentAPI({
        token,
        orderId: order._id,
        gateway: paymentMethod,
      });

      // 4️⃣ Route payment to correct gateway handler
      await gatewayHandler(payment, paymentMethod);

      return order;
    },

    // ----------------------------------------------------
    // MUTATION CALLBACKS
    // ----------------------------------------------------
    {
      onSuccess: () => queryClient.invalidateQueries(['cart']),
      onError: (err) =>
        alert(err.message || 'Something went wrong during checkout.'),
    }
  );

  return {
    placeOrder: placeOrderMutation.mutateAsync,
    isLoading: placeOrderMutation.isLoading,
    isError: placeOrderMutation.isError,
    error: placeOrderMutation.error,
  };
}
