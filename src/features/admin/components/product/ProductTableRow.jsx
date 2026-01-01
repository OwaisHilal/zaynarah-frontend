// src/features/admin/components/product/ProductTableRow.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateProductStock } from '../../hooks/useUpdateProductStock';
import {
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const price = typeof product?.price === 'number' ? product.price : 0;
  const stockValue = typeof product?.stock === 'number' ? product.stock : 0;

  const image = product?.images?.[0] || product?.image || null;

  const [editingStock, setEditingStock] = useState(false);
  const [draftStock, setDraftStock] = useState(stockValue);

  const updateStock = useUpdateProductStock();

  // Inventory Logic Mapping
  const getStockStatus = (value) => {
    if (value === 0)
      return {
        label: 'Out of stock',
        color: 'text-rose-600 bg-rose-50 border-rose-100',
        Icon: AlertTriangle,
      };
    if (value <= 10)
      return {
        label: 'Low Stock',
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        Icon: Package,
      };
    return {
      label: 'In Stock',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      Icon: CheckCircle2,
    };
  };

  const status = getStockStatus(stockValue);

  const submitStock = () => {
    if (draftStock === stockValue || draftStock === '') {
      setEditingStock(false);
      return;
    }

    updateStock.mutate(
      { id, stock: Math.max(0, Number(draftStock)) },
      { onSuccess: () => setEditingStock(false) }
    );
  };

  return (
    <tr
      className={cn(
        'group transition-all duration-200',
        isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/80'
      )}
    >
      {' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex items-center justify-center">
          {' '}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 transition-all cursor-pointer"
          />{' '}
        </div>{' '}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    '[https://via.placeholder.com/150?text=No+Image](https://via.placeholder.com/150?text=No+Image)';
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300">
                <ImageIcon size={20} />
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 truncate text-sm">
              {title}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              SKU: {id?.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">
          {category || 'Uncategorized'}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="font-black text-slate-900 text-sm">
            ₹{price.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            Standard Price
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-2">
          {editingStock ? (
            <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
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
                className="w-20 h-8 rounded-lg border border-indigo-200 bg-white px-2 py-1 text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none shadow-inner"
              />
              {updateStock.isLoading && (
                <Loader2 size={12} className="animate-spin text-indigo-600" />
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setDraftStock(stockValue);
                setEditingStock(true);
              }}
              className="group/stock flex items-center gap-2 text-left"
            >
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider transition-all',
                  status.color
                )}
              >
                <status.Icon size={12} />
                {status.label}: {stockValue}
              </div>
              <Edit3
                size={12}
                className="text-slate-300 opacity-0 group-hover/stock:opacity-100 transition-opacity"
              />
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Edit3 size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            onClick={() => onDelete(id)}
            className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900"
          >
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
