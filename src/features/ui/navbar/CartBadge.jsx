import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../cart/hooks/cartStore';

export default function CartBadge({ onClick }) {
  const cart = useCartStore((s) => s.cart);

  return (
    <button
      onClick={onClick}
      className="relative opacity-80 hover:opacity-100 transition"
      aria-label="Open cart"
    >
      <ShoppingBag size={22} />

      {cart.length > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            bg-primary text-primary-foreground text-[10px]
            px-1.5 py-0.5 rounded-full
          "
        >
          {cart.length}
        </span>
      )}
    </button>
  );
}
