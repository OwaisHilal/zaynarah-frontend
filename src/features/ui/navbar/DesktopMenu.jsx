/* frontend/src/features/ui/navbar/DesktopMenu.jsx */
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/features/user/hooks/useUser';

export default function DesktopMenu() {
  const { user } = useUserStore();

  return (
    <div className="hidden md:flex items-center gap-8">
      <Link
        to="/"
        className="text-sm font-medium text-text-secondary hover:text-text-primary transition"
      >
        Home
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-sm font-medium">
            Shop
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48 rounded-xl">
          <DropdownMenuItem asChild>
            <Link to="/shop">All Products</Link>
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

      {user && (
        <Link
          to="/orders"
          className="text-sm font-medium text-text-secondary hover:text-text-primary transition"
        >
          Orders
        </Link>
      )}

      <Link
        to="/the-craft"
        className="text-sm font-medium text-text-secondary hover:text-text-primary transition"
      >
        The Craft
      </Link>
    </div>
  );
}
