import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Shawls', to: '/shop?category=shawls' },
  { name: 'Scarves', to: '/shop?category=scarves' },
  { name: 'Accessories', to: '/shop?category=accessories' },
  { name: 'The Craft', to: '/the-craft' },
  { name: 'Contact', to: '/contact' },
];

export default function NavLinks() {
  return (
    <div className="flex items-center gap-10">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className="
            text-[15px] tracking-wide font-medium
            text-gray-800 dark:text-gray-200
            hover:text-primary
            transition-colors
          "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
