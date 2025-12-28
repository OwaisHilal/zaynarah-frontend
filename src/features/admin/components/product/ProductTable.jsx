import { ProductTableRow } from './ProductTableRow';

export function ProductTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  deletingId,
}) {
  const allSelected =
    products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
          <tr>
            {/* Select all */}
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
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
          {products.length > 0 ? (
            products.map((p) => {
              const id = p.id || p._id;

              return (
                <ProductTableRow
                  key={id}
                  product={p}
                  isSelected={selectedIds.includes(id)}
                  onToggleSelect={() => onToggleSelect(id)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={deletingId === id}
                />
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-neutral-500"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
