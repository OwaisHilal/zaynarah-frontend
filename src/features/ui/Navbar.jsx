// src/features/ui/Navbar.jsx
import Logo from './navbar/Logo';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';
import ThemeToggle from './navbar/ThemeToggle';
import CartBadge from './navbar/CartBadge';
import UserMenu from './navbar/UserMenu';
import { useNavbarScroll } from './navbar/hooks/useNavbarScroll';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSearchContext from '@/features/search/context/useSearchContext';
import MiniCart from '../cart/components/MiniCart';

export default function Navbar() {
  const scrolled = useNavbarScroll();
  const { setOpen } = useSearchContext();

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b backdrop-blur-xl transition-colors',
        scrolled ? 'bg-bg-primary/90' : 'bg-bg-primary/70',
        'border-border',
      ].join(' ')}
      role="banner"
    >
      <nav
        className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between"
        aria-label="Primary"
      >
        <Logo />

        <DesktopMenu />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => setOpen(true)}
          >
            <Search size={18} />
          </Button>
          <MiniCart>
            <CartBadge />
          </MiniCart>
          <UserMenu />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
