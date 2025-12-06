import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import CartBadge from './CartBadge';
import { useUserStore } from '../../user/hooks/useUser';

export default function MobileMenu() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden p-2">
          <div className="w-6 h-[2px] bg-black mb-1"></div>
          <div className="w-6 h-[2px] bg-black mb-1"></div>
          <div className="w-6 h-[2px] bg-black"></div>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-6 w-64">
        <nav className="flex flex-col gap-6 text-lg font-medium">
          <Link to="/">Home</Link>

          <Collapsible>
            <CollapsibleTrigger className="flex justify-between">
              Shop
            </CollapsibleTrigger>

            <CollapsibleContent className="flex flex-col gap-2 pl-3 mt-2">
              <Link to="/shop">All</Link>
              <Link to="/shop?category=shawls">Shawls</Link>
              <Link to="/shop?category=scarves">Scarves</Link>
              <Link to="/shop?category=accessories">Accessories</Link>
            </CollapsibleContent>
          </Collapsible>

          <CartBadge />

          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
