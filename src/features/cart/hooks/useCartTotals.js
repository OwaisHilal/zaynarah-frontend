// src/features/cart/hooks/useCartTotals.js
import { useCartDomainStore } from '@/stores/cart';

export default function useCartTotals() {
  const count = useCartDomainStore((s) => s.count);
  const total = useCartDomainStore((s) => s.total);

  return { count, total };
}
