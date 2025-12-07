// src/features/checkout/hooks/CartContext.jsx
import { createContext, useContext } from 'react';
import { useCartStore } from '../../cart/hooks/cartStore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartStore = useCartStore();
  return (
    <CartContext.Provider value={cartStore}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
