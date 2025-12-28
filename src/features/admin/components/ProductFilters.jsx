import { Button } from '@/components/ui/button';

export function ProductFilters({ category, onCategoryChange, onAddClick }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Products</h1>
        <p className="text-sm text-neutral-500">
          Manage your catalog and inventory
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">All categories</option>
          <option value="shirts">Shirts</option>
          <option value="tshirts">T-Shirts</option>
          <option value="pants">Pants</option>
          <option value="accessories">Accessories</option>
        </select>

        <Button onClick={onAddClick}>Add product</Button>
      </div>
    </div>
  );
}
