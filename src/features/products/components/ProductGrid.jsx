// src/features/products/components/ProductGrid.jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ items = [], pageSize = 9 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((product) => (
        <ProductCard key={product.id ?? product._id} product={product} />
      ))}
    </div>
  );
}
