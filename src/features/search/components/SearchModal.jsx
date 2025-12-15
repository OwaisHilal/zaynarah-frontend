import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, Check, Clock } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import useSearchContext from '../context/useSearchContext';
import { useSearch } from '../hooks/useSearch';
import useRecentSearches from '../hooks/useRecentSearches';
import useSearchAnalytics from '../hooks/useSearchAnalytics';

import { useCartStore } from '@/features/cart/hooks/cartStore';

export default function SearchModal() {
  const { open, setOpen } = useSearchContext();
  const { query, results, loading, search } = useSearch();
  const { recent, addSearch, clearRecent } = useRecentSearches();
  const analytics = useSearchAnalytics();

  const [activeIndex, setActiveIndex] = useState(-1);
  const [addedId, setAddedId] = useState(null);

  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);

  const containerRef = useRef(null);

  /* ----------------------------------------
     Reset state on open / query change
  ---------------------------------------- */
  useEffect(() => {
    if (!open) return;
    setActiveIndex(-1);
    setAddedId(null);
    analytics.trackOpen();
  }, [open]);

  /* ----------------------------------------
     Track query typing (debounced inside hook)
  ---------------------------------------- */
  useEffect(() => {
    if (query) analytics.trackQuery(query);
  }, [query]);

  /* ----------------------------------------
     Keyboard navigation (modal-scoped)
  ---------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const node = containerRef.current;
    if (!node) return;

    const handler = (e) => {
      if (!results.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const item = results[activeIndex];
        if (!item?._id) return;

        analytics.trackResultClick({
          query,
          productId: item._id,
        });

        addSearch(query);
        setOpen(false);
        navigate(`/product/${item._id}`);
      }
    };

    node.addEventListener('keydown', handler);

    return () => {
      node.removeEventListener('keydown', handler);
    };
  }, [open, results, activeIndex, query]);

  /* ----------------------------------------
     Add to cart from search
  ---------------------------------------- */
  const handleAdd = (item) => {
    analytics.trackAddToCart({
      query,
      productId: item._id,
    });

    addToCart({
      id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: 1,
    });

    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  /* ----------------------------------------
     Zero results tracking
  ---------------------------------------- */
  useEffect(() => {
    if (!loading && query.length > 2 && results.length === 0) {
      analytics.trackNoResults(query);
    }
  }, [results, loading, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={containerRef}
        className="max-w-xl p-0 overflow-hidden focus:outline-none"
        aria-label="Search products"
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search size={18} className="opacity-60" />
          <Input
            autoFocus
            placeholder="Search products…"
            value={query}
            onChange={(e) => search(e.target.value)}
            className="border-none focus-visible:ring-0 bg-transparent"
          />
          {loading && <Loader2 className="animate-spin" size={16} />}
        </div>

        {/* Recent Searches */}
        {!query && recent.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-text-secondary">
                Recent Searches
              </p>
              <button
                onClick={clearRecent}
                className="text-xs text-text-secondary hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recent.map((item) => (
                <button
                  key={item}
                  onClick={() => search(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm hover:bg-bg-secondary transition"
                >
                  <Clock size={12} />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.length > 1 && !loading && (
            <p className="px-4 py-8 text-sm text-text-secondary text-center">
              No products found for “{query}”
            </p>
          )}

          {results.map((item, index) => {
            const active = index === activeIndex;
            const added = addedId === item._id;

            return (
              <div
                key={item._id}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 transition cursor-pointer',
                  active ? 'bg-bg-secondary' : 'hover:bg-bg-secondary'
                )}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <Link
                  to={`/product/${item._id}`}
                  onClick={() => {
                    analytics.trackResultClick({
                      query,
                      productId: item._id,
                    });
                    addSearch(query);
                    setOpen(false);
                  }}
                  className="flex items-center gap-4 flex-1"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-text-secondary">₹{item.price}</p>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd(item);
                  }}
                  className={cn(
                    'flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition',
                    added
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-bg-secondary'
                  )}
                  aria-label="Add to cart"
                >
                  {added ? <Check size={14} /> : <Plus size={14} />}
                  {added ? 'Added' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-xs text-text-secondary border-t flex justify-between">
          <span>↑ ↓ to navigate · Enter to open</span>
          <span>Esc to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
