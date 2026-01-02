// frontend/src/features/admin/components/dashboard/LowStockProductsCard.jsx
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function LowStockProductsCard({ products = [], onExport }) {
  const normalizedProducts = useMemo(
    () =>
      products
        .map((p) => ({
          id: p._id || p.id,
          title: p.title,
          stock: Number(p.stock) || 0,
          category: p.category,
          isCritical: (Number(p.stock) || 0) <= 2,
        }))
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6), // Keep it tight: only top 6 risks
    [products]
  );

  return (
    <Card className="border-none ring-1 ring-slate-200 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col">
      {/* Header: Tight & Minimal */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Inventory Risk
          </h3>
        </div>
        <button
          onClick={onExport}
          className="text-slate-400 hover:text-slate-900 transition-colors"
        >
          <Download size={14} />
        </button>
      </div>

      {/* Table-style List: Zero wasted space */}
      <div className="flex-1">
        {normalizedProducts.length === 0 ? (
          <div className="py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System Nominal / No Risks
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Item
                </th>
                <th className="px-6 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {normalizedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-900 truncate max-w-[140px]">
                        {p.title}
                      </span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">
                        {p.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={cn(
                          'text-[11px] font-black tabular-nums',
                          p.isCritical ? 'text-rose-600' : 'text-amber-600'
                        )}
                      >
                        {p.stock}
                      </span>
                      <div
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          p.isCritical
                            ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                            : 'bg-amber-400'
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer: Action-oriented, No extra padding */}
      <Link
        to="/admin/products"
        className="px-6 py-4 bg-slate-50 flex items-center justify-between group hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers
            size={14}
            className="text-slate-400 group-hover:text-indigo-600 transition-colors"
          />
          <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">
            Inventory Manager
          </span>
        </div>
        <ArrowRight
          size={14}
          className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"
        />
      </Link>
    </Card>
  );
}
