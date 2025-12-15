// src/features/cart/context/useCart.js
import { useContext } from 'react';
import CartContext from './CartContextInstance';

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
