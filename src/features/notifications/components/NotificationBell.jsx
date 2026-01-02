// frontend/src/features/notifications/components/NotificationBell.jsx
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useNotificationsStore } from '../store/notificationsStore';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const { unreadCount, loadUnreadCount } = useNotificationsStore();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : 'Notifications'
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            aria-live="polite"
            className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center px-1"
          >
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <NotificationDropdown
          triggerRef={buttonRef}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
