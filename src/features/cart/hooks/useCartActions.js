// src/features/cart/hooks/useCartActions.js
import { useCartDomainStore } from '@/stores/cart';

const normalizeId = (item) => item?.productId || item?.id || item?._id || item;

export default function useCartActions() {
  const add = useCartDomainStore((s) => s.add);
  const updateQty = useCartDomainStore((s) => s.updateQty);
  const remove = useCartDomainStore((s) => s.remove);
  const clear = useCartDomainStore((s) => s.clear);

  return {
    addItem: (product, qty = 1) => add(product, qty),
    updateQty: (id, qty) => updateQty(normalizeId(id), qty),
    removeItem: (id) => remove(normalizeId(id)),
    clearCart: () => clear(),
  };
}
