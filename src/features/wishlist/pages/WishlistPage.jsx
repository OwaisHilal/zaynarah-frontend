// src/features/wishlist/pages/WishlistPage.jsx
import useWishlist from '@/features/wishlist/hooks/useWishlist';
import WishlistEmpty from '../components/WishlistEmpty';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useWishlistActions from '@/features/wishlist/hooks/useWishlistActions';

export default function WishlistPage() {
  const { items, isEmpty, hydrated } = useWishlist();
  const { removeFromWishlist } = useWishlistActions();

  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        Loading wishlist…
      </div>
    );
  }

  if (isEmpty) {
    return <WishlistEmpty />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Heart size={20} />
          Wishlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Items you’ve saved for later
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <article
            key={item.productId}
            className="group border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition"
          >
            <Link to={`/product/${item.productId}`}>
              <div className="h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            <div className="p-4 space-y-3">
              <h3 className="font-medium text-lg line-clamp-1">
                <Link to={`/product/${item.productId}`}>{item.title}</Link>
              </h3>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold">₹{item.price}</span>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="text-sm text-muted-foreground hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
