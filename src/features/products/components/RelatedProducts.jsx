// src/features/products/components/RelatedProducts.jsx
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productsApi';
import ProductCard from './ProductCard';

export default function RelatedProducts({ product }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        // Example: fetch products from the same category excluding the current product
        const allProducts = await getProducts({ category: product.category });
        const filtered = allProducts.filter((p) => p.id !== product.id);
        setRelated(filtered.slice(0, 4)); // Show max 4 related products
      } catch (err) {
        console.error('Failed to fetch related products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [product]);

  if (loading) return null; // or a spinner

  if (related.length === 0) return null; // nothing to show

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
