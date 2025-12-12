// src/features/cart/context/CartContext.jsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useCartStore } from '../hooks/cartStore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartStore = useCartStore();

  const cartTotal = useMemo(() => {
    return cartStore.cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  }, [cartStore.cart]);

  const cartCount = useMemo(() => {
    return cartStore.cart.reduce(
      (sum, item) => sum + (Number(item.qty) || 0),
      0
    );
  }, [cartStore.cart]);

  const hasItems = cartStore.cart.length > 0;

  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  const initCheckoutSession = useCallback(async (token) => {
    if (!token)
      throw new Error('User must be logged in to initialize checkout session.');

    try {
      const res = await fetch('/api/checkout/session/init', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!data.checkoutSessionId)
        throw new Error('Failed to create checkout session.');

      setCheckoutSessionId(data.checkoutSessionId);
      return data;
    } catch (err) {
      console.error('Checkout session init failed:', err);
      throw err;
    }
  }, []);

  const resetCheckoutSession = useCallback(() => {
    setCheckoutSessionId(null);
    cartStore.clearCart();
  }, [cartStore]);

  const getRazorpayAmount = useCallback(
    () => Math.round(cartTotal * 100),
    [cartTotal]
  );
  const getStripeAmount = useCallback(
    () => Math.round(cartTotal * 100),
    [cartTotal]
  );

  const value = {
    ...cartStore,
    cartTotal,
    cartCount,
    hasItems,
    checkoutSessionId,
    setCheckoutSessionId,
    initCheckoutSession,
    resetCheckoutSession,
    getRazorpayAmount,
    getStripeAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
