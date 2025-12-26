import { useState, useMemo, useCallback, useEffect } from 'react';
import CartContext from './CartContextInstance';
import { useCartStore } from '../hooks/cartStore';

export const CartProvider = ({ children }) => {
  const cart = useCartStore((s) => s.cart);
  const cartStore = useCartStore();

  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const hasItems = cart.length > 0;

  useEffect(() => {
    cartStore.fetchCart();
  }, []);

  const initCheckoutSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Login required');

    const res = await fetch('/api/orders/checkout/session/init', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Checkout session init failed');

    const data = await res.json();
    if (!data.checkoutSessionId) {
      throw new Error('Invalid checkout session response');
    }

    setCheckoutSessionId(data.checkoutSessionId);
    return data;
  }, []);

  const resetCheckoutSession = useCallback(() => {
    setCheckoutSessionId(null);
    cartStore.clearCart();
  }, [cartStore]);

  const value = useMemo(
    () => ({
      ...cartStore,
      cart,
      cartTotal,
      cartCount,
      hasItems,
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
