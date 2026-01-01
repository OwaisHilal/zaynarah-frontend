// src/features/admin/components/product/ProductTable.jsx
import React from 'react';
import { ProductTableRow } from './ProductTableRow';
import { cn } from '@/lib/utils';

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
    <div className="relative overflow-hidden">
      {' '}
      <div className="overflow-x-auto">
        {' '}
        <table className="w-full text-sm text-left border-collapse">
          {' '}
          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
            {' '}
            <tr>
              {' '}
              <th className="px-6 py-4 w-12">
                {' '}
                <div className="flex items-center justify-center">
                  {' '}
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll(ids)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 transition-all cursor-pointer"
                  />{' '}
                </div>{' '}
              </th>{' '}
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Product Details
              </th>{' '}
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Category
              </th>{' '}
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Valuation
              </th>{' '}
              <th className="px-4 py-4 font-black uppercase tracking-widest text-[10px]">
                Inventory Status
              </th>{' '}
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">
                Operations
              </th>{' '}
            </tr>{' '}
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => {
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
