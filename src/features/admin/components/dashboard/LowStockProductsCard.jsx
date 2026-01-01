// frontend/src/features/admin/components/dashboard/LowStockProductsCard.jsx
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowRight,
  FileDown,
  PackageSearch,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function LowStockProductsCard({ products = [], onExport }) {
  const count = products.length;

  const normalizedProducts = useMemo(
    () =>
      products
        .map((p) => {
          const stock = Number(p.stock) || 0;
          const isCritical = stock <= 2;
          // Percentage calculation for a max visibility threshold of 10
          return {
            id: p._id || p.id,
            title: p.title,
            category: p.category,
            stock: stock,
            isCritical,
            percentage: Math.min(100, (stock / 10) * 100),
          };
        })
        .sort((a, b) => a.stock - b.stock),
    [products]
  );

  return (
    <Card className="border-none ring-1 ring-slate-200 bg-white flex flex-col h-full shadow-xl shadow-slate-200/40 rounded-[32px] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center transition-colors',
              count > 0
                ? 'bg-rose-50 text-rose-600'
                : 'bg-emerald-50 text-emerald-600'
            )}
          >
            {count > 0 ? <AlertCircle size={20} /> : <Zap size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-none">
              Stock Alerts
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">
              {count === 0
                ? 'Inventory Healthy'
                : `${count} items below threshold`}
            </p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onExport}
          disabled={count === 0}
          className="rounded-xl hover:bg-slate-50 transition-all h-9 w-9"
        >
          <FileDown size={18} className="text-slate-400" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[340px] max-h-[450px]">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
              <PackageSearch className="text-slate-200" size={36} />
            </div>
            <p className="text-sm font-black text-slate-900">All Clear</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px] font-medium">
              Your inventory levels are currently within safe parameters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {normalizedProducts.map((p) => (
              <div
                key={p.id}
                className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all group"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
                  <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {p.title}
                  </span>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase tracking-tight',
                        p.isCritical ? 'text-rose-600' : 'text-amber-600'
                      )}
                    >
                      {p.stock} Left
                    </span>
                  </div>

                  {/* Progress Bar with Glow Effect for Critical */}
                  <div className="w-full max-w-[160px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-1000 ease-out rounded-full',
                        p.isCritical
                          ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                          : 'bg-amber-400'
                      )}
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {p.isCritical && (
                    <div className="animate-pulse">
                      <Badge className="bg-rose-50 text-rose-600 border-rose-100 text-[8px] font-black px-1.5 h-5 rounded-lg shadow-sm">
                        REORDER
                      </Badge>
                    </div>
                  )}
                  <div className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-white shadow-sm">
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="p-4 border-t border-slate-50 bg-white">
        <Link to="/admin/products">
          <Button
            variant="ghost"
            className="w-full justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl px-4 group"
          >
            Full Inventory Audit
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
