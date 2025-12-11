// src/features/checkout/hooks/useCheckout.js
import { useState, useCallback } from 'react';
import { useCart } from './CartContext';
import {
  placeOrderAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
  verifyRazorpayPaymentAPI,
} from '../services/useCheckoutApi';
import { startPayment } from './usePaymentHandler';

export default function useCheckout(initialStep = 1, totalSteps = 6) {
  const { checkoutSessionId, setCheckoutSessionId } = useCart();

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // VALIDATION PER STEP
  // ----------------------------------------------------
  const validateStep = useCallback(
    (step = currentStep) => {
      switch (step) {
        case 2:
          if (!shippingAddress) return 'Please select a shipping address.';
          break;
        case 3:
          if (!billingAddress) return 'Please select a billing address.';
          break;
        case 4:
          if (!shippingMethod) return 'Please select a shipping method.';
          break;
        case 5:
          if (!paymentMethod) return 'Please select a payment method.';
          if (!paymentDetails) return 'Please fill in your payment details.';
          break;
        default:
          return null;
      }
      return null;
    },
    [
      currentStep,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
    ]
  );

  const isNextDisabled = useCallback(() => !!validateStep(), [validateStep]);

  // ----------------------------------------------------
  // STEP NAVIGATION
  // ----------------------------------------------------
  const nextStep = useCallback(() => {
    const err = validateStep();
    if (err) return alert(err);
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }, [validateStep, totalSteps]);

  const prevStep = useCallback(
    () => setCurrentStep((s) => Math.max(s - 1, 1)),
    []
  );

  // ----------------------------------------------------
  // BUILD CHECKOUT PAYLOAD
  //        ----------------------------------------------------
  const buildCheckoutPayload = useCallback(
    ({ cart, cartTotal }) => {
      if (!cart?.length) throw new Error('Your cart is empty.');

      return {
        cart,
        cartTotal,
        user,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        shippingMethod,
        paymentMethod,
        paymentDetails,
      };
    },
    [
      user,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
    ]
  );

  // ----------------------------------------------------
  // PLACE ORDER + PAYMENT FLOW
  // ----------------------------------------------------
  const placeOrder = useCallback(
    async ({ cart, cartTotal }) => {
      setLoading(true);
      try {
        // 1️⃣ Validate current step / details
        const err = validateStep();
        if (err) throw new Error(err);

        // 2️⃣ Build order payload
        const payload = buildCheckoutPayload({ cart, cartTotal });

        // 3️⃣ Create order via API
        const order = await placeOrderAPI(payload);
        setOrderData(order);

        // 4️⃣ Start payment gateway if applicable
        if (paymentMethod && order._id) {
          if (paymentMethod === 'stripe') {
            const session = await createStripeSessionAPI(order._id);
            await startPayment('stripe', session);
          }

          if (paymentMethod === 'razorpay') {
            const razorOrder = await createRazorpayOrderAPI(order._id);
            await startPayment('razorpay', razorOrder);
          }
        }

        return order;
      } catch (err) {
        console.error('Checkout error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [validateStep, buildCheckoutPayload, paymentMethod]
  );

  // ----------------------------------------------------
  // RESET CHECKOUT
  // ----------------------------------------------------
  const resetCheckout = useCallback(() => {
    setCurrentStep(1);
    setShippingAddress(null);
    setBillingAddress(null);
    setShippingMethod(null);
    setPaymentMethod('stripe');
    setPaymentDetails(null);
    setOrderData(null);
    setUser(null);
    setCheckoutSessionId(null);
    setLoading(false);
  }, [setCheckoutSessionId]);

  // ----------------------------------------------------
  // RETURN
  // ----------------------------------------------------
  return {
    currentStep,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails,
    user,
    orderData,
    loading,

    // setters
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setPaymentMethod,
    setPaymentDetails,
    setUser,
    setOrderData,

    // navigation
    nextStep,
    prevStep,
    isNextDisabled,

    // checkout actions
    buildCheckoutPayload,
    placeOrder,
    resetCheckout,
  };
}
