import Logo from './navbar/Logo';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';
import ThemeToggle from './navbar/ThemeToggle';
import { useNavbarScroll } from './navbar/hooks/useNavbarScroll';

export default function Navbar() {
  const scrolled = useNavbarScroll();

  return (
    <header
      className={`sticky top-0 z-50 transition-all backdrop-blur-xl border-b
        ${
          scrolled
            ? 'bg-rose-50/60 dark:bg-black/40 py-3 shadow-sm'
            : 'bg-rose-50/30 dark:bg-black/20 py-5'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        <DesktopMenu />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
