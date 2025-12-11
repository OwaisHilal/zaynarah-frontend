// src/features/checkout/utils/checkoutHelpers.js

/**
 * Format a number as currency
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Validate an address object
 */
export const validateAddress = (address) => {
  if (!address) return false;
  const requiredFields = [
    'name',
    'line1',
    'city',
    'state',
    'postalCode',
    'country',
  ];
  return requiredFields.every((field) => address[field]?.trim());
};

/**
 * Validate payment details for Stripe or Razorpay
 */
export const validatePaymentDetails = (paymentMethod, paymentDetails) => {
  if (!paymentMethod || !paymentDetails) return false;

  switch (paymentMethod) {
    case 'stripe':
      return !!paymentDetails.email?.trim();
    case 'razorpay':
      return !!paymentDetails.name?.trim() && !!paymentDetails.phone?.trim();
    default:
      return false;
  }
};

/**
 * Calculate cart total
 * cart: [{ price, quantity }]
 */
export const calculateCartTotal = (cart = []) => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
