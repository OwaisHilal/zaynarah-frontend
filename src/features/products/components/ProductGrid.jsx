// src/features/products/components/ProductGrid.jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((p) => (
        <ProductCard key={p._id || p.id} product={p} />
      ))}
    </div>
  );
}
