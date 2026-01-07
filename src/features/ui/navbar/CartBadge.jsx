// src/features/ui/navbar/CartBadge.jsx
import { ShoppingBag } from 'lucide-react';
import useCartTotals from '@/features/cart/hooks/useCartTotals';

export default function CartBadge({ onClick }) {
  const { count } = useCartTotals();

  return (
    <button
      onClick={onClick}
      className="relative opacity-80 hover:opacity-100 transition"
      aria-label="Open cart"
    >
      <ShoppingBag size={22} />

      {count > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            bg-primary text-primary-foreground text-[10px]
            px-1.5 py-0.5 rounded-full
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}
