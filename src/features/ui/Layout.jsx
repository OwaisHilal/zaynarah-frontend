import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className={cn('flex flex-col min-h-screen bg-gray-50')}>
      {/* Navbar */}
      <Navbar />

      {/* Main content fills remaining space */}
      <main className={cn('flex-1 w-full px-6 py-8')}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
