// src/features/products/pages/ProductPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductsDomainStore } from '@/stores/products';

import ProductGallery from '../components/ProductPage/ProductGallery';
import ProductDetails from '../components/ProductPage/ProductDetails';
import ProductVariants from '../components/ProductPage/ProductVariants';
import ProductActions from '../components/ProductPage/ProductActions';
import ProductReviewsConnector from '../components/ProductPage/ProductReviewsConnector';
import SizeGuideModal from '../components/ProductPage/SizeGuideModal';
import MobileStickyCTA from '../components/ProductPage/MobileStickyCTA';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductPage() {
  const { id } = useParams();
  const fetchById = useProductsDomainStore((s) => s.fetchById);
  const loading = useProductsDomainStore((s) => s.loading);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('zaynarah_wishlist') || '[]')
  );

  useEffect(() => {
    let mounted = true;
    fetchById(id).then((p) => {
      if (!mounted || !p) return;
      const normalized = {
        ...p,
        images: p.images ?? (p.image ? [p.image] : []),
        variants: p.variants ?? [],
      };
      setProduct(normalized);
      setMainImage(normalized.images[0] ?? null);
    });
    return () => {
      mounted = false;
    };
  }, [id, fetchById]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading product…
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <section className="lg:col-span-7">
            <ProductGallery
              product={product}
              mainImage={mainImage}
              setMainImage={setMainImage}
            />
          </section>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl bg-card p-6 space-y-6 shadow-sm">
                <ProductDetails product={product} />

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
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20 pt-12 border-t">
          <ProductReviewsConnector productId={product._id} />
        </section>

        <section className="mt-20">
          <RelatedProducts product={product} />
        </section>
      </div>

      <MobileStickyCTA product={product} mainImage={mainImage} />

      {showSizeGuide && <SizeGuideModal setShowSizeGuide={setShowSizeGuide} />}
    </div>
  );
}
