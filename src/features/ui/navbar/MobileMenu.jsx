/* frontend/src/features/ui/navbar/MobileMenu.jsx */
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import CartBadge from './CartBadge';
import { useUserStore } from '../../user/hooks/useUser';

export default function MobileMenu() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-sm p-6">
        <div className="mb-8">
          {user ? (
            <>
              <p className="text-sm text-text-secondary">Signed in as</p>
              <p className="font-semibold">{user.name}</p>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium">
              Sign in →
            </Link>
          )}
        </div>

        <div className="space-y-3">
          <Link to="/">Home</Link>
        </div>

        <div className="space-y-4 mt-8">
          <h4 className="text-xs uppercase tracking-widest text-text-secondary">
            Shop
          </h4>

          <Link to="/shop" className="block text-lg font-medium">
            All Products
          </Link>
          <Link to="/shop?category=shawls">Shawls</Link>
          <Link to="/shop?category=scarves">Scarves</Link>
          <Link to="/shop?category=accessories">Accessories</Link>
        </div>

        {user && (
          <div className="space-y-3 mt-10">
            <h4 className="text-xs uppercase tracking-widest text-text-secondary">
              Account
            </h4>

            <Link to="/orders" className="text-lg font-medium">
              My Orders
            </Link>

            <Link to="/profile">Profile</Link>
          </div>
        )}

        <div className="mt-10 space-y-4">
          <CartBadge fullWidth />

          {user && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
