// src/features/wishlist/components/WishlistEmpty.jsx
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistEmpty() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <Heart size={40} className="text-muted-foreground" />
      <h2 className="text-lg font-medium">Your wishlist is empty</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Save items you love to your wishlist so you can find them easily later.
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Browse products
      </Link>
    </div>
  );
}
