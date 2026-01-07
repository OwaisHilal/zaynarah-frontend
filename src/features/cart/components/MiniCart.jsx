// src/features/cart/components/MiniCart.jsx
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

import useCart from '@/features/cart/hooks/useCart';
import useCartTotals from '@/features/cart/hooks/useCartTotals';

import MiniCartItem from './MiniCartItem';
import MiniCartEmpty from './MiniCartEmpty';

export default function MiniCart({ children }) {
  const { items, isEmpty } = useCart();
  const { total } = useCartTotals();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col"
      >
        <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
        <SheetDescription className="sr-only">
          Review items in your cart before checkout
        </SheetDescription>

        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={18} />
            Cart
          </h3>
          <span className="text-sm text-muted-foreground">
            {items.length} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isEmpty ? (
            <MiniCartEmpty />
          ) : (
            items.map((item) => (
              <MiniCartItem key={item.productId} item={item} />
            ))
          )}
        </div>

        {!isEmpty && (
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
