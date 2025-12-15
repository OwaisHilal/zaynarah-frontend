//src/features/ui/navbar/UserMenu.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../user/hooks/useUser';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className="hidden md:inline-flex"
      >
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account"
          className="rounded-full"
        >
          {user.name?.[0] ?? 'U'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/orders">Orders</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
