import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../hooks/cartStore';
import MiniCartItem from './MiniCartItem';
import MiniCartEmpty from './MiniCartEmpty';

export default function MiniCart({ children }) {
  const cart = useCartStore((s) => s.cart);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={18} />
            Cart
          </h3>
          <span className="text-sm text-muted-foreground">
            {cart.length} items
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <MiniCartEmpty />
          ) : (
            cart.map((item) => (
              <MiniCartItem key={item.productId} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex items-center justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <Button asChild className="w-full">
              <Link to="/checkout">Checkout</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link to="/cart">View Cart</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
