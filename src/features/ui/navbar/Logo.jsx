import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';
import { cn } from '@/lib/utils';

export default function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-2 hover:opacity-90 transition-opacity',
        className
      )}
    >
      <img
        src={logoImg}
        alt="Zaynarah Logo"
        className="h-10 w-10 object-contain"
      />
      <span className="text-2xl font-semibold tracking-tight select-none">
        Zaynarah
      </span>
    </Link>
  );
}
