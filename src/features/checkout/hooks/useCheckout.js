// src/features/checkout/hooks/useCheckout.js
import { useState } from 'react';

export default function useCheckout(initialStep = 1, totalSteps = 3) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // ← added user state

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetCheckout = () => {
    setCurrentStep(1);
    setSelectedAddress(null);
    setPaymentMethod('stripe');
    setOrderData(null);
    setLoading(false);
    setUser(null); // reset user
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

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
    isFirstStep,
    isLastStep,
    user, // expose user
    setUser, // expose setter
  };
}
