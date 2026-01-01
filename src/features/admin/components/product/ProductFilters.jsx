// src/features/admin/components/product/ProductFilters.jsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsStore } from '../../stores/productsStore';

export function ProductFilters() {
  const { category, searchInput, setCategory, setSearchInput, clearSelection } =
    useProductsStore();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Products</h1>
        <p className="text-sm text-neutral-500">
          Manage your catalog and inventory
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="w-64"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">All categories</option>
          <option value="shirts">Shirts</option>
          <option value="tshirts">T-Shirts</option>
          <option value="pants">Pants</option>
          <option value="accessories">Accessories</option>
        </select>

        <Button onClick={clearSelection}>Add product</Button>
      </div>
    </div>
  );
}
