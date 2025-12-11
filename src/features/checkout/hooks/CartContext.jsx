// src/features/checkout/hooks/CartContext.jsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useCartStore } from '../../cart/hooks/cartStore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartStore = useCartStore();

  // --- Derived values ---
  const cartTotal = useMemo(
    () => cartStore.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartStore.cart]
  );

  const cartCount = useMemo(
    () => cartStore.cart.reduce((sum, item) => sum + item.qty, 0),
    [cartStore.cart]
  );

  // --- Server-side checkout session ID ---
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  // --- Gateway specific amounts ---
  const getRazorpayAmount = () => Math.round(cartTotal * 100); // paisa
  const getStripeAmount = () => Math.round(cartTotal * 100); // cents

  // --- Initialize checkout session on backend ---
  const initCheckoutSession = useCallback(async (token) => {
    if (!token)
      throw new Error('User must be logged in to initialize checkout session.');

    const res = await fetch('/api/checkout/session/init', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!data.checkoutSessionId)
      throw new Error('Failed to create checkout session.');

    setCheckoutSessionId(data.checkoutSessionId);
    return data;
  }, []);

  // --- Reset cart & session ---
  const resetCheckoutSession = useCallback(() => {
    setCheckoutSessionId(null);
    cartStore.clearCart();
  }, [cartStore]);

  const value = {
    ...cartStore,
    cartTotal,
    cartCount,
    getRazorpayAmount,
    getStripeAmount,
    hasItems: cartStore.cart.length > 0,
    checkoutSessionId,
    setCheckoutSessionId,
    initCheckoutSession,
    resetCheckoutSession,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
