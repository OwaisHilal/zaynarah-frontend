// src/features/checkout/hooks/CartContext.jsx
import { createContext, useContext, useMemo } from 'react';
import { useCartStore } from '../../cart/hooks/cartStore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartStore = useCartStore();

  // --- Derived values ---
  const cartTotal = useMemo(() => {
    return cartStore.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartStore.cart]);

  const cartCount = useMemo(() => {
    return cartStore.cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cartStore.cart]);

  // --- Gateway specific amounts ---
  // Razorpay requires amount in PAISA (₹100 → 10000)
  const getRazorpayAmount = () => Math.round(cartTotal * 100);

  // Stripe uses CENTS ($100 → 10000)
  const getStripeAmount = () => Math.round(cartTotal * 100);

  const value = {
    ...cartStore, // all store methods & state
    cartTotal,
    cartCount,
    getRazorpayAmount,
    getStripeAmount,
    hasItems: cartStore.cart.length > 0, // useful for checkout validation
    clearCart: cartStore.clearCart || (() => {}), // prevent crashes if not implemented
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
