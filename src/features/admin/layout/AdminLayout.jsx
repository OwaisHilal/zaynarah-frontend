// frontend/src/features/admin/layout/AdminLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const baseItem =
  'flex items-center rounded-md px-3 py-2 text-sm transition-colors';
const activeItem = 'bg-neutral-200 text-neutral-900';
const inactiveItem =
  'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-neutral-100 text-neutral-900">
      <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white px-5 py-6 flex flex-col">
        <div className="mb-10">
          <div className="text-xs font-medium tracking-wide text-neutral-500">
            ADMIN
          </div>
          <div className="mt-1 text-lg font-semibold text-neutral-900">
            Zaynarah
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              cn(baseItem, isActive ? activeItem : inactiveItem)
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              cn(baseItem, isActive ? activeItem : inactiveItem)
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              cn(baseItem, isActive ? activeItem : inactiveItem)
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              cn(baseItem, isActive ? activeItem : inactiveItem)
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              cn(baseItem, isActive ? activeItem : inactiveItem)
            }
          >
            Payments
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-200">
          <button className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-neutral-50 px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}
