import { ProductTableRow } from './ProductTableRow';

export function ProductTable({ products, onEdit, onDelete, deletingId }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Product</th>
            <th className="px-4 py-3 text-left font-medium">Price</th>
            <th className="px-4 py-3 text-left font-medium">Stock</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductTableRow
                key={p.id || p._id}
                product={p}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingId === (p.id || p._id)}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-neutral-500"
              >
                No products found in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
