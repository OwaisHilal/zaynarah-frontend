// src/features/products/pages/ShopPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../../../features/products/services/productsApi';
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

// gold & black constants (used inline for safety)
const GOLD = '#D4AF37';
const DEEP_BLACK = '#0A0A0A';

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
      const params = {
        page,
        limit: 9,
        category: selectedCategory || undefined,
        priceMax: priceRange.value,
        sort,
      };

      const res = await fetchProducts(params);
      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);

      const uniqueCategories = Array.from(
        new Set((res.data || []).map((p) => p.category).filter(Boolean))
      );
      setCategories(uniqueCategories);

      const maxPrice = Math.max(
        ...(res.data || []).map((p) => p.price || 0),
        1000
      );
      setPriceRange((prev) => ({
        ...prev,
        max: maxPrice,
        value: Math.min(prev.value, maxPrice),
      }));
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, priceRange.value, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleReset = () => {
    setSelectedCategory('');
    setPriceRange((prev) => ({ ...prev, value: prev.max }));
    setSort('createdAt:desc');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div
            className="mb-4 animate-pulse"
            style={{
              height: 6,
              width: 200,
              background: '#e6e6e6',
              borderRadius: 6,
            }}
          />
          <div className="text-lg">Loading products…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white">
      {/* Lux Hero / Banner */}
      <section
        className="relative h-[40vh] flex items-center"
        style={{
          backgroundImage: "url('/HeroImg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.45), rgba(10,10,10,0.65))',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl text-white">
            <h1
              className="text-5xl md:text-6xl font-serif font-bold leading-tight uppercase tracking-widest"
              style={{ color: '#fff' }}
            >
              The Pashmina Collection
            </h1>
            <p className="mt-4 text-lg max-w-xl opacity-90">
              Handwoven luxury from the valleys of Kashmir — refined textures,
              timeless silhouettes.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="/shop"
                className="inline-block px-6 py-3 rounded-full text-sm font-medium"
                style={{
                  background: GOLD,
                  color: DEEP_BLACK,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                }}
              >
                Shop The Collection
              </a>

              <a
                href="/the-craft"
                className="inline-block px-6 py-3 rounded-full text-sm font-medium border"
                style={{
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.95)',
                  background: 'transparent',
                }}
              >
                The Craft
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-6">
          <div className="text-sm text-gray-600 font-medium">
            Showing{' '}
            <span className="font-semibold text-gray-900">{items.length}</span>{' '}
            items
          </div>

          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter size={16} /> Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <ProductFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => {
                      setSelectedCategory(cat);
                      setPage(1);
                      setIsSheetOpen(false);
                    }}
                    priceRange={priceRange}
                    onPriceChange={(value) => {
                      setPriceRange((prev) => ({ ...prev, value }));
                      setPage(1);
                    }}
                    onReset={() => {
                      handleReset();
                      setIsSheetOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort:</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="border rounded-sm text-sm p-2 bg-white"
                style={{ borderColor: 'rgba(0,0,0,0.06)' }}
              >
                <option value="createdAt:desc">Newest</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="rating:desc">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <ProductGrid items={items} pageSize={9} />

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition disabled:opacity-50"
            style={{
              borderColor: 'rgba(0,0,0,0.06)',
              background: 'transparent',
              color: DEEP_BLACK,
            }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <div
            className="flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg"
            style={{
              border: `2px solid ${GOLD}`,
              color: DEEP_BLACK,
              background: '#fff',
            }}
          >
            {page}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition disabled:opacity-50"
            style={{
              borderColor: 'rgba(0,0,0,0.06)',
              background: 'transparent',
              color: DEEP_BLACK,
            }}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
