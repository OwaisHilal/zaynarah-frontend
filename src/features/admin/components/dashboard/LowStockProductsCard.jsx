import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function LowStockProductsCard({ products, onExport }) {
  return (
    <Card className="border border-neutral-200 bg-white flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-800">
            Low Stock Alerts
          </span>
          <Badge variant="destructive" className="rounded-sm px-1.5 h-5">
            {products.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          className="h-8 text-xs"
        >
          Export
        </Button>
      </div>

      <div className="p-6 overflow-auto max-h-[400px]">
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-neutral-500">
              All products are well stocked.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li
                key={p._id || p.id}
                className="flex items-center justify-between group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-tight text-neutral-400">
                    {p.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-rose-600">
                    {p.stock} left
                  </span>
                  <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${(p.stock / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
