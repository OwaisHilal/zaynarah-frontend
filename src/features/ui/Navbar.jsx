// src/features/ui/Navbar.jsx
import Logo from './navbar/Logo';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';
import ThemeToggle from './navbar/ThemeToggle';
import CartBadge from './navbar/CartBadge';
import UserMenu from './navbar/UserMenu';
import { useNavbarScroll } from './navbar/hooks/useNavbarScroll';

export default function Navbar() {
  const scrolled = useNavbarScroll();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors
        ${scrolled ? 'bg-bg-primary/90' : 'bg-bg-primary/70'}
      `}
      role="banner"
    >
      <nav
        className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between"
        aria-label="Primary"
      >
        {/* Left */}
        <Logo />

        {/* Center (desktop) */}
        <DesktopMenu />

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartBadge />
          <UserMenu />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
