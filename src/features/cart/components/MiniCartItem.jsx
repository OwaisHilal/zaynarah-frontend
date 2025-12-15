import { X } from 'lucide-react';
import { useCartStore } from '../hooks/cartStore';

export default function MiniCartItem({ item }) {
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  return (
    <div className="flex gap-3 items-start">
      <img
        src={item.image}
        alt={item.title}
        className="h-16 w-16 rounded-md object-cover"
      />

      <div className="flex-1">
        <p className="text-sm font-medium leading-tight">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Qty: {item.qty || 1}
        </p>
        <p className="text-sm font-semibold mt-1">₹{item.price}</p>
      </div>

      <button
        onClick={() => removeFromCart(item.productId)}
        className="text-muted-foreground hover:text-destructive transition"
        aria-label="Remove item"
      >
        <X size={14} />
      </button>
    </div>
  );
}
