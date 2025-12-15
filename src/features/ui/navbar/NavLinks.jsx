//src/features/ui/navbar/NavLinks.jsx
import { Link } from 'react-router-dom';

const navItems = [
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
