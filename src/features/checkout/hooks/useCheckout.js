// src/features/checkout/hooks/useCheckout.js
import { useState } from 'react';

export default function useCheckout(initialStep = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetCheckout = () => {
    setCurrentStep(1);
    setSelectedAddress(null);
    setPaymentMethod('stripe');
    setOrderData(null);
    setLoading(false);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    orderData,
    setOrderData,
    loading,
    setLoading,
    resetCheckout,
  };
}
