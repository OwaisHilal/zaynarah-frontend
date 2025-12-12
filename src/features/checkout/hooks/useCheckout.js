// src/features/checkout/hooks/useCheckout.js
import { useState, useCallback } from 'react';
import { useCart } from '../../cart/context/CartContext';
import {
  placeOrderAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
} from '../services/useCheckoutApi';
import { startPayment } from './usePaymentHandler';

export default function useCheckout(initialStep = 1, totalSteps = 5) {
  const cartCtx = useCart() || {};
  const { checkoutSessionId, setCheckoutSessionId } = cartCtx;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [shippingAddress, setShippingAddress] = useState(null); // step 1
  const [shippingMethod, setShippingMethod] = useState(null); // step 2
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // step 3
  const [billingAddress, setBillingAddress] = useState(null); // optional / step 4
  const [paymentDetails, setPaymentDetails] = useState(null); // step 4
  const [orderData, setOrderData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // VALIDATION PER STEP
  const validateStep = useCallback(
    (step = currentStep) => {
      switch (step) {
        case 1:
          if (!shippingAddress) return 'Please select a shipping address.';
          return null;
        case 2:
          if (!shippingMethod) return 'Please select a shipping method.';
          return null;
        case 3:
          if (!paymentMethod) return 'Please select a payment method.';
          return null;
        case 4:
          if (!paymentMethod) return 'Please select a payment method.';
          // Razorpay requires name + phone in your UI
          if (paymentMethod === 'razorpay') {
            if (!paymentDetails?.name)
              return 'Full name required for Razorpay.';
            if (!paymentDetails?.phone)
              return 'Phone number required for Razorpay.';
          }
          // billingAddress validations (if required) should be handled by billing form
          return null;
        case 5:
          // final review check
          if (!shippingAddress) return 'Missing shipping address.';
          if (!shippingMethod) return 'Missing shipping method.';
          if (!paymentMethod) return 'Missing payment method.';
          if (paymentMethod === 'razorpay') {
            if (!paymentDetails?.name) return 'Payment details incomplete.';
            if (!paymentDetails?.phone) return 'Payment details incomplete.';
          }
          return null;
        default:
          return null;
      }
    },
    [
      currentStep,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
    ]
  );

  const isNextDisabled = useCallback(
    (step = currentStep) => !!validateStep(step),
    [validateStep, currentStep]
  );

  // NAV
  const nextStep = useCallback(() => {
    const err = validateStep();
    if (err) {
      // let caller (page) show UI message; fallback to alert for dev
      alert(err);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }, [validateStep, totalSteps]);

  const prevStep = useCallback(
    () => setCurrentStep((s) => Math.max(s - 1, 1)),
    []
  );

  // BUILD PAYLOAD: normalize cart items to backend shape
  const buildCheckoutPayload = useCallback(
    ({ cart, cartTotal }) => {
      if (!Array.isArray(cart) || cart.length === 0) {
        throw new Error('Your cart is empty.');
      }

      const items = cart.map((c) => {
        // Accept different shapes: { productId } or { product: { _id } } etc.
        const productId =
          c.productId || (c.product && c.product._id) || c.id || c._id;
        return {
          productId,
          title: c.title || c.name || '',
          price: Number(c.price || 0),
          qty: Number(c.qty || c.quantity || 1),
          image: c.image || '',
          sku: c.sku || '',
        };
      });

      return {
        items,
        cartTotal: {
          items: Number((cartTotal && cartTotal.items) || 0),
          shipping: Number((cartTotal && cartTotal.shipping) || 0),
          tax: Number((cartTotal && cartTotal.tax) || 0),
          grand: Number((cartTotal && cartTotal.grand) || 0),
          currency: (cartTotal && cartTotal.currency) || 'INR',
        },
        user,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        shippingMethod,
        paymentMethod,
        paymentDetails,
        metadata: {
          createdFrom: 'frontend',
        },
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

  // PLACE ORDER + PAYMENT HANDLER
  const placeOrder = useCallback(
    async ({ cart, cartTotal }) => {
      setLoading(true);
      try {
        // Validate final step (payment details)
        const validationError = validateStep(4);
        if (validationError) throw new Error(validationError);

        const payload = buildCheckoutPayload({ cart, cartTotal });

        // Create order on backend (status: pending/draft)
        const order = await placeOrderAPI(payload);
        setOrderData(order);

        // Kick off payment according to selected gateway
        if (paymentMethod && order && order._id) {
          if (paymentMethod === 'stripe') {
            // expected: { sessionId, publishableKey } from createStripeSessionAPI
            const session = await createStripeSessionAPI(order._id);
            if (!session || !session.sessionId || !session.publishableKey) {
              // support alternate property names (robustness)
              const sid =
                session?.sessionId || session?.id || session?.checkoutSessionId;
              const pk =
                session?.publishableKey ||
                session?.publishable_key ||
                session?.publishable;
              if (!sid || !pk)
                throw new Error('Stripe session creation failed.');
              await startPayment('stripe', {
                publishableKey: pk,
                sessionId: sid,
              });
            } else {
              await startPayment('stripe', {
                publishableKey: session.publishableKey,
                sessionId: session.sessionId,
              });
            }
          } else if (paymentMethod === 'razorpay') {
            // expected: { orderId, key, amount, currency }
            const rp = await createRazorpayOrderAPI(order._id);
            // support alternative keys
            const orderId = rp?.orderId || rp?.id || rp?.order_id;
            const key = rp?.key || rp?.key_id || rp?.keyId;
            const amount = rp?.amount;
            const currency = rp?.currency;
            if (!orderId || !key || !amount) {
              throw new Error('Razorpay order creation failed.');
            }
            await startPayment('razorpay', {
              key,
              amount,
              currency,
              orderId,
            });
          }
        }

        return order;
      } catch (err) {
        // bubble up consistent Error
        console.error('useCheckout.placeOrder error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [validateStep, buildCheckoutPayload, paymentMethod]
  );

  // RESET CHECKOUT
  const resetCheckout = useCallback(() => {
    setCurrentStep(1);
    setShippingAddress(null);
    setShippingMethod(null);
    setBillingAddress(null);
    setPaymentMethod('stripe');
    setPaymentDetails(null);
    setOrderData(null);
    setUser(null);
    if (typeof setCheckoutSessionId === 'function') setCheckoutSessionId(null);
    setLoading(false);
  }, [setCheckoutSessionId]);

  return {
    // state
    currentStep,
    shippingAddress,
    shippingMethod,
    billingAddress,
    paymentMethod,
    paymentDetails,
    user,
    orderData,
    loading,
    checkoutSessionId: checkoutSessionId || null,

    // setters
    setShippingAddress,
    setShippingMethod,
    setBillingAddress,
    setPaymentMethod,
    setPaymentDetails,
    setUser,
    setOrderData,
    setCheckoutSessionId:
      typeof setCheckoutSessionId === 'function'
        ? setCheckoutSessionId
        : () => {},

    // navigation
    nextStep,
    prevStep,
    isNextDisabled,
    validateStep,

    // actions
    buildCheckoutPayload,
    placeOrder,
    resetCheckout,
  };
}
