// src/features/checkout/hooks/useCheckout.js
import { useState } from 'react';
import { useCart } from './CartContext';
import {
  useCreateOrder,
  useCreateStripeSession,
  useCreateRazorpayOrder,
  useVerifyRazorpayPayment,
} from '../services/useCheckoutApi';

export default function useCheckout(initialStep = 1, totalSteps = 6) {
  const { checkoutSessionId, setCheckoutSessionId } = useCart();

  // ------------------------
  // Local step states
  // ------------------------
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [user, setUser] = useState(null);

  // ------------------------
  // React Query hooks (Phase 1 → only prepared, not executed)
  // ------------------------
  const createOrderMutation = useCreateOrder();
  const stripeSessionMutation = useCreateStripeSession();
  const razorpayOrderMutation = useCreateRazorpayOrder();
  const verifyRazorpayMutation = useVerifyRazorpayPayment();

  // ------------------------
  // Step validation
  // ------------------------
  const validateStep = (step = currentStep) => {
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
  };

  // ------------------------
  // Navigation
  // ------------------------
  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      alert(error);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  // ------------------------
  // Phase 1: Only BUILD the order payload
  // (Actual payments handled in Phase 2)
  // ------------------------
  const buildCheckoutPayload = (cart, cartTotal) => {
    if (!cart?.length) throw new Error('Cart is empty');
    if (!paymentMethod || !paymentDetails)
      throw new Error('Payment details missing');

    return {
      items: cart,
      totalAmount: cartTotal,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
      user: user?._id,
    };
  };

  // ------------------------
  // Phase 1: Prepare the order (API call optional)
  // This returns the order but does NOT trigger payment UI.
  // ------------------------
  const createOrder = async (checkoutPayload) => {
    const order = await createOrderMutation.mutateAsync(checkoutPayload);
    setOrderData(order);
    return order;
  };

  // ------------------------
  // Reset checkout
  // ------------------------
  const resetCheckout = () => {
    setCurrentStep(1);
    setShippingAddress(null);
    setBillingAddress(null);
    setShippingMethod(null);
    setPaymentMethod('stripe');
    setPaymentDetails(null);
    setOrderData(null);
    setUser(null);
  };

  return {
    // states
    currentStep,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails,
    orderData,
    user,

    // setters
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setPaymentMethod,
    setPaymentDetails,
    setOrderData,
    setUser,

    // actions
    nextStep,
    prevStep,
    resetCheckout,
    buildCheckoutPayload,
    createOrder,

    // expose prepared mutations (SDK Phase 2 uses these)
    createOrderMutation,
    stripeSessionMutation,
    razorpayOrderMutation,
    verifyRazorpayMutation,
  };
}
