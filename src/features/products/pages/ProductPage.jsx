import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchProductById } from '../services/productsApi';

import ProductGallery from '../components/ProductPage/ProductGallery';
import ProductDetails from '../components/ProductPage/ProductDetails';
import ProductVariants from '../components/ProductPage/ProductVariants';
import ProductActions from '../components/ProductPage/ProductActions';
import ProductReviews from '../components/ProductPage/ProductReviews';
import SizeGuideModal from '../components/ProductPage/SizeGuideModal';
import MobileStickyCTA from '../components/ProductPage/MobileStickyCTA';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('zaynarah_wishlist') || '[]')
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const p = await fetchProductById(id);
        if (!mounted) return;

        const normalized = {
          ...p,
          images: p.images ?? (p.image ? [p.image] : []),
          variants: p.variants ?? [],
        };

        setProduct(normalized);
        setMainImage(normalized.images[0] ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <main className="bg-background">
      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* GALLERY */}
          <section className="lg:col-span-7">
            <ProductGallery
              product={product}
              mainImage={mainImage}
              setMainImage={setMainImage}
            />
          </section>

          {/* BUY BOX */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl bg-card p-6 space-y-6 shadow-sm">
                <ProductDetails product={product} />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Handwoven in Kashmir by master artisans. Each piece takes
                  weeks to complete and carries subtle variations — a mark of
                  authenticity, not imperfection.
                </p>

                <ProductVariants
                  product={product}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                  setShowSizeGuide={setShowSizeGuide}
                />

                <ProductActions
                  product={product}
                  mainImage={mainImage}
                  qty={qty}
                  setQty={setQty}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  selectedVariant={selectedVariant}
                />

                <p className="text-xs text-muted-foreground">
                  Free shipping · Easy 7-day returns · Secure checkout
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* REVIEWS — NATURAL CONTINUATION */}
        <section className="mt-20 pt-12 border-t">
          <ProductReviews product={product} />
        </section>

        {/* RELATED — SOFT EXIT */}
        <section className="mt-20">
          <RelatedProducts product={product} />
        </section>
      </div>

      {/* MOBILE CTA */}
      <MobileStickyCTA product={product} mainImage={mainImage} />

      {/* MODALS */}
      {showSizeGuide && <SizeGuideModal setShowSizeGuide={setShowSizeGuide} />}
    </main>
  );
}
