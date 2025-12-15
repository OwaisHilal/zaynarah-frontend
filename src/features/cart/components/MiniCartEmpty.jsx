import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MiniCartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
      <ShoppingBag size={36} className="opacity-30" />
      <p className="text-sm text-muted-foreground">Your cart is empty</p>
      <Link to="/shop" className="text-sm font-medium underline">
        Browse products
      </Link>
    </div>
  );
}
