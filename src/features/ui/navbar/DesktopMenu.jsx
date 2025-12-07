import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import CartBadge from './CartBadge';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useUserStore } from '../../user/hooks/useUser';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function DesktopMenu() {
  const { user } = useUserStore();

  return (
    <div className="hidden md:flex items-center justify-center flex-1 gap-12">
      {/* Center Navigation */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-3">
            Shop
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem asChild>
            <Link to="/shop">All</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/shop?category=shawls">Shawls</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/shop?category=scarves">Scarves</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/shop?category=accessories">Accessories</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Other Links */}
      <NavLinks />

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <CartBadge />

        {user ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition"
            >
              Login
            </Link>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-full px-5"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
