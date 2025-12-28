import { Button } from '@/components/ui/button';

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const id = product.id || product._id;
  const inStock = (product.stock ?? 0) > 0;

  const image =
    product.images?.[0] ||
    product.image ||
    'https://via.placeholder.com/64?text=No+Image';

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-neutral-300"
        />
      </td>

      {/* Product (Image + Title) */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
            <img
              src={image}
              alt={product.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/64?text=No+Image';
              }}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 leading-tight">
              {product.title}
            </span>
            {product.category && (
              <span className="text-xs text-neutral-500">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-neutral-600">₹{product.price}</td>

      {/* Stock */}
      <td className="px-4 py-3 text-neutral-600">{product.stock ?? '—'}</td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            inStock
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}
        >
          {inStock ? 'In stock' : 'Out of stock'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            disabled={isDeleting}
            onClick={() => onDelete(id)}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </td>
    </tr>
  );
}
