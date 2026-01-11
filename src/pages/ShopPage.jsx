// frontend/src/pages/ShopPage.jsx
import { useEffect, useMemo } from 'react';
import ProductGrid from '@/features/products/components/ProductGrid';
import ProductFilters from '@/features/products/components/ProductFilters';
import { ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useProductsDomainStore, useProductsUIStore } from '@/stores/products';

export default function ShopPage() {
  const { ids, entities, loading, pagination, fetchList } =
    useProductsDomainStore();

  const {
    category,
    priceMax,
    sort,
    page,
    sheetOpen,
    setCategory,
    setPriceMax,
    setSort,
    setPage,
    setSheetOpen,
    reset,
  } = useProductsUIStore();

  useEffect(() => {
    fetchList({
      page,
      limit: 9,
      category: category || undefined,
      priceMax,
      sort,
    });
  }, [page, category, priceMax, sort, fetchList]);

  const items = ids.map((id) => entities[id]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((p) => p.category).filter(Boolean))),
    [items]
  );

  const maxPrice = Math.max(...items.map((p) => p.price || 0), 1000);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading collection…
      </div>
    );
  }

  return (
    <div className="bg-bg-primary pb-24">
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

      <section className="max-w-7xl mx-auto px-6 mb-10 flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing{' '}
          <span className="font-medium text-foreground">{items.length}</span>{' '}
          pieces
        </div>

        <div className="flex gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                selectedCategory={category}
                onCategoryChange={(v) => {
                  setCategory(v);
                  setSheetOpen(false);
                }}
                priceRange={{ max: maxPrice, value: priceMax }}
                onPriceChange={setPriceMax}
                onReset={() => {
                  reset();
                  setSheetOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="price:asc">Price: Low → High</option>
            <option value="price:desc">Price: High → Low</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <ProductGrid items={items} />
      </section>

      <section className="mt-16 flex justify-center items-center gap-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-5 py-2 rounded-full border text-sm disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Previous
        </button>

        <span className="font-medium">{page}</span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
          className="px-5 py-2 rounded-full border text-sm disabled:opacity-40"
        >
          Next <ArrowRight size={14} />
        </button>
      </section>
    </div>
  );
}
