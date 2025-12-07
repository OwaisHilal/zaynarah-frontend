// src/features/products/components/ProductGrid.jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ items = [], cols = 3 }) {
  const gridCols =
    cols === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {items.map((it) => (
        <ProductCard key={it.id ?? it._id} product={it} />
      ))}
    </div>
  );
}
