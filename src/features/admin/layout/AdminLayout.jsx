// frontend/src/features/admin/layout/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  LogOut,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  Command,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const NavContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {' '}
      <div
        className={cn(
          'flex items-center gap-3 px-6 h-16 border-b border-slate-100',
          isCollapsed && !mobile && 'justify-center px-0'
        )}
      >
        {' '}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200">
          {' '}
          <Command size={20} strokeWidth={2.5} />{' '}
        </div>{' '}
        {(!isCollapsed || mobile) && (
          <div className="flex flex-col">
            {' '}
            <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">
              ZAYNARAH
            </span>{' '}
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
              Enterprise
            </span>{' '}
          </div>
        )}{' '}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                isCollapsed && !mobile && 'justify-center px-2'
              )
            }
          >
            <item.icon
              className={cn(
                'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                (location.pathname === item.path && !item.end) ||
                  (item.end && location.pathname === item.path)
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-600'
              )}
            />
            {(!isCollapsed || mobile) && (
              <span className="ml-3 truncate">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100 space-y-2">
        {(!isCollapsed || mobile) && (
          <div className="bg-slate-50 rounded-xl p-3 mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Storage
            </p>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[65%]" />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">
              8.2GB of 12GB used
            </p>
          </div>
        )}
        <button
          className={cn(
            'group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200',
            isCollapsed && !mobile && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-500" />
          {(!isCollapsed || mobile) && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {' '}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isCollapsed ? 'w-[80px]' : 'w-64'
        )}
      >
        {' '}
        <NavContent />{' '}
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-8 border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-none">
                <NavContent mobile />
              </SheetContent>
            </Sheet>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all active:scale-95"
            >
              <Menu
                size={16}
                className={cn(
                  'transition-transform',
                  !isCollapsed && 'rotate-180'
                )}
              />
            </button>

            <div className="relative w-full max-w-md hidden sm:block group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Search
                  size={16}
                  className="text-slate-400 group-focus-within:text-slate-900 transition-colors"
                />
              </div>
              <Input
                id="global-search"
                placeholder="Search analytics, orders..."
                className="w-full h-10 border-slate-200 bg-slate-50/50 pl-10 pr-12 focus-visible:ring-offset-0 focus-visible:ring-slate-200 transition-all rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400">
                <Command size={10} /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-slate-500 rounded-xl"
            >
              <HelpCircle size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            </Button>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 p-1 pr-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                      <AvatarImage src="[https://api.dicebear.com/7.x/avataaars/svg?seed=Admin](https://api.dicebear.com/7.x/avataaars/svg?seed=Admin)" />
                      <AvatarFallback className="bg-slate-900 text-white text-[10px] font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">
                      Alexander Thorne
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">
                      Administrator
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-2xl shadow-xl border-slate-200"
              >
                <DropdownMenuLabel className="font-bold text-slate-500 text-[10px] uppercase tracking-wider px-3 py-2">
                  Account Settings
                </DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center gap-3 rounded-xl cursor-pointer py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Users size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      Team Management
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Invite and manage roles
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 rounded-xl cursor-pointer py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Settings size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      System Preferences
                    </span>
                    <span className="text-[10px] text-slate-500">
                      API keys and security
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem className="text-red-600 rounded-xl cursor-pointer py-2.5 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                  <LogOut className="mr-3 h-4 w-4" />{' '}
                  <span className="text-sm font-bold">
                    Sign out of Zaynarah
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
