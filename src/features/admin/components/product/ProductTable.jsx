// src/features/admin/components/product/ProductTable.jsx

import { ProductTableRow } from './ProductTableRow';

export function ProductTable({
  products = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  deletingId,
}) {
  const ids = products.map((p) => p._id || p.id);
  const allSelected = ids.length > 0 && selectedIds.length === ids.length;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleSelectAll(ids)}
                className="h-4 w-4 rounded border-neutral-300"
              />
            </th>

            <th className="px-4 py-3 text-left font-medium">Product</th>
            <th className="px-4 py-3 text-left font-medium">Price</th>
            <th className="px-4 py-3 text-left font-medium">Stock</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-neutral-500"
              >
                No products found matching your filters.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const id = product._id || product.id;

              return (
                <ProductTableRow
                  key={id}
                  product={product}
                  isSelected={selectedIds.includes(id)}
                  onToggleSelect={() => onToggleSelect(id)}
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(id)}
                  isDeleting={deletingId === id}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
