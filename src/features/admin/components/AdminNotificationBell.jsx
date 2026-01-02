import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useAdminNotificationsStore } from '../stores/adminNotificationsStore';
import AdminNotificationsDropdown from './AdminNotificationsDropdown';

export default function AdminNotificationBell() {
  const { unreadCount, fetchUnreadCount } = useAdminNotificationsStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-slate-500 hover:bg-slate-50 rounded-xl"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        )}
      </Button>

      {open && <AdminNotificationsDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
