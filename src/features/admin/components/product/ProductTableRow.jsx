// src/features/admin/components/product/ProductTableRow.jsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateProductStock } from '../../hooks/useUpdateProductStock';

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const id = product?._id || product?.id;
  const title = product?.title || 'Untitled product';
  const category = product?.category;
  const price = typeof product?.price === 'number' ? `₹${product.price}` : '—';
  const stockValue = typeof product?.stock === 'number' ? product.stock : 0;

  const image =
    product?.images?.[0] ||
    product?.image ||
    'https://via.placeholder.com/64?text=No+Image';

  const [editingStock, setEditingStock] = useState(false);
  const [draftStock, setDraftStock] = useState(stockValue);

  const updateStock = useUpdateProductStock();

  let stockLabel = 'Out of stock';
  let stockClasses = 'bg-rose-50 text-rose-700 border-rose-100';

  if (stockValue > 10) {
    stockLabel = 'In stock';
    stockClasses = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  } else if (stockValue > 0) {
    stockLabel = 'Low stock';
    stockClasses = 'bg-amber-50 text-amber-700 border-amber-100';
  }

  const submitStock = () => {
    if (draftStock === stockValue) {
      setEditingStock(false);
      return;
    }

    updateStock.mutate(
      { id, stock: Math.max(0, Number(draftStock)) },
      { onSuccess: () => setEditingStock(false) }
    );
  };

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-neutral-300"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/64?text=No+Image';
              }}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-medium text-neutral-900 truncate">
              {title}
            </span>
            {category && (
              <span className="text-xs text-neutral-500 truncate">
                {category}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-neutral-700">{price}</td>

      <td
        className="px-4 py-3 text-neutral-700 cursor-pointer"
        onClick={() => {
          setDraftStock(stockValue);
          setEditingStock(true);
        }}
      >
        {editingStock ? (
          <input
            type="number"
            value={draftStock}
            autoFocus
            min={0}
            onChange={(e) => setDraftStock(e.target.value)}
            onBlur={submitStock}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitStock();
              if (e.key === 'Escape') setEditingStock(false);
            }}
            className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
        ) : (
          stockValue
        )}
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${stockClasses}`}
        >
          {stockLabel}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
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
