// src/features/cart/hooks/useCart.js
import { useCartDomainStore } from '@/stores/cart';

export default function useCart() {
  const items = useCartDomainStore((s) => s.items);

  return {
    items,
    isEmpty: items.length === 0,
  };
}
