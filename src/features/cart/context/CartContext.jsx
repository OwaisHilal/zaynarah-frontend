// src/features/cart/context/CartContext.jsx
import { useState, useMemo, useCallback } from 'react';
import CartContext from './CartContextInstance';
import { useCartStore } from '../hooks/cartStore';

export const CartProvider = ({ children }) => {
  // --- SELECT ALL CART STORE FIELDS ---
  const cart = useCartStore((s) => s.cart);
  const cartStore = useCartStore(); // get full store object

  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  // --- CART TOTALS ---
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const hasItems = cart.length > 0;

  // --- CHECKOUT SESSION HELPERS ---
  const initCheckoutSession = useCallback(async (token) => {
    if (!token) throw new Error('Login required');

    const res = await fetch('/api/checkout/session/init', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!data.checkoutSessionId) {
      throw new Error('Checkout session failed');
    }

    setCheckoutSessionId(data.checkoutSessionId);
    return data;
  }, []);

  const resetCheckoutSession = useCallback(() => {
    setCheckoutSessionId(null);
    cartStore.clearCart(); // Zustand clearCart
  }, [cartStore]);

  // --- PROVIDER VALUE ---
  const value = useMemo(
    () => ({
      // cart store data
      ...cartStore,
      cart,
      cartTotal,
      cartCount,
      hasItems,

      // checkout session fields
      checkoutSessionId,
      setCheckoutSessionId,
      initCheckoutSession,
      resetCheckoutSession,
    }),
    [
      cartStore,
      cart,
      cartTotal,
      cartCount,
      hasItems,
      checkoutSessionId,
      initCheckoutSession,
      resetCheckoutSession,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
