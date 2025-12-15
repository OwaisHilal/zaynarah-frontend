//src/features/ui/navbar/Logo.jsx
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';
import { cn } from '@/lib/utils';

export default function Logo({ className }) {
  return (
    <Link
      to="/"
      aria-label="Zaynarah Home"
      className={cn(
        'flex items-center gap-2 font-serif text-text-primary hover:opacity-90 transition',
        className
      )}
    >
      <img
        src={logoImg}
        alt=""
        className="h-9 w-9 object-contain"
        aria-hidden
      />
      <span className="text-xl font-semibold tracking-tight select-none">
        Zaynarah
      </span>
    </Link>
  );
}
