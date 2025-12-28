import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LowStockProductsCard({ products }) {
  return (
    <Card className="border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-800">
          Low stock alerts
        </h3>
        <Badge variant="destructive">{products.length}</Badge>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          All products have healthy stock 🎉
        </p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p._id} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {p.title}
                </span>
                {p.category && (
                  <span className="text-xs text-neutral-500">{p.category}</span>
                )}
              </div>

              <Badge
                variant="outline"
                className="text-rose-600 border-rose-200"
              >
                {p.stock} left
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
