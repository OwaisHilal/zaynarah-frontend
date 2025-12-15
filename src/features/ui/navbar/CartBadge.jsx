//src/features/ui/navbar/CartBadge.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../cart/hooks/cartStore';
import { cn } from '@/lib/utils';

export default function CartBadge({ fullWidth = false }) {
  const cart = useCartStore((s) => s.cart);
  const count = cart.length;

  return (
    <Link
      to="/cart"
      aria-label={`Cart with ${count} items`}
      className={cn(
        'relative flex items-center justify-center rounded-full border border-border-subtle transition',
        fullWidth ? 'w-full py-3' : 'h-10 w-10',
        'hover:bg-bg-secondary'
      )}
    >
      <ShoppingBag size={18} />

      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
            rounded-full bg-brand-rose text-white text-[10px]
            flex items-center justify-center"
          aria-live="polite"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
