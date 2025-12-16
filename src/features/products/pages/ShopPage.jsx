// src/features/products/pages/ShopPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/productsApi';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import { ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ max: 1000, value: 1000 });
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        page,
        limit: 9,
        category: selectedCategory || undefined,
        priceMax: priceRange.value,
        sort,
      });

      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);

      setCategories(
        Array.from(
          new Set((res.data || []).map((p) => p.category).filter(Boolean))
        )
      );

      const maxPrice = Math.max(
        ...(res.data || []).map((p) => p.price || 0),
        1000
      );

      setPriceRange((p) => ({
        ...p,
        max: maxPrice,
        value: Math.min(p.value, maxPrice),
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, priceRange.value, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading collection…
      </div>
    );
  }

  return (
    <main className="bg-bg-primary pb-24">
      {/* HERO */}
      <section
        className="relative h-[42vh] flex items-center"
        style={{
          backgroundImage: "url('/HeroImg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif text-white">
            The Pashmina Collection
          </h1>
          <p className="mt-4 max-w-xl text-white/90 text-lg">
            Handwoven luxury from Kashmir — timeless, rare, enduring.
          </p>
        </div>
      </section>

      {/* TRANSITION */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <p className="text-sm uppercase tracking-widest text-text-secondary">
          Curated Selection
        </p>
        <p className="mt-4 text-lg text-foreground leading-relaxed">
          Each piece is woven by master artisans using centuries-old techniques.
          Refine the collection to discover what speaks to you.
        </p>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-text-secondary">
          Showing{' '}
          <span className="font-medium text-foreground">{items.length}</span>{' '}
          pieces
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={14} /> Refine
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Refine Collection</SheetTitle>
              </SheetHeader>
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(c) => {
                  setSelectedCategory(c);
                  setPage(1);
                  setIsSheetOpen(false);
                }}
                priceRange={priceRange}
                onPriceChange={(v) => {
                  setPriceRange((p) => ({ ...p, value: v }));
                  setPage(1);
                }}
                onReset={() => {
                  setSelectedCategory('');
                  setPriceRange((p) => ({ ...p, value: p.max }));
                  setSort('createdAt:desc');
                  setPage(1);
                  setIsSheetOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="price:asc">Price: Low → High</option>
            <option value="price:desc">Price: High → Low</option>
          </select>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6">
        <ProductGrid items={items} />
      </section>

      {/* PAGINATION */}
      <section className="mt-16 flex justify-center items-center gap-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-5 py-2 rounded-full border text-sm disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Previous
        </button>

        <span className="font-medium">{page}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-5 py-2 rounded-full border text-sm disabled:opacity-40"
        >
          Next <ArrowRight size={14} />
        </button>
      </section>
    </main>
  );
}
