// src/features/products/pages/ProductPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/productsApi';
import ProductGallery from '../components/ProductPage/ProductGallery';
import ProductDetails from '../components/ProductPage/ProductDetails';
import ProductVariants from '../components/ProductPage/ProductVariants';
import ProductActions from '../components/ProductPage/ProductActions';
import SizeGuideModal from '../components/ProductPage/SizeGuideModal';
import Toast from '../components/ProductPage/Toast';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('zaynarah_wishlist') || '[]')
  );
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Fetch product by id
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const p = await fetchProductById(id);
        setProduct({
          ...p,
          images: p.images ?? (p.image ? [p.image] : []),
          variants: p.variants ?? p.options ?? [],
        });
        setMainImage(p.images?.[0] ?? p.image ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Images */}
        <ProductGallery
          product={product}
          mainImage={mainImage}
          setMainImage={setMainImage}
        />

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
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
            toast={toast}
            setToast={setToast}
            copied={copied}
            setCopied={setCopied}
          />
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts product={product} />

      {/* Modals & Toasts */}
      {showSizeGuide && <SizeGuideModal setShowSizeGuide={setShowSizeGuide} />}
      <Toast toast={toast} copied={copied} />
    </main>
  );
}
