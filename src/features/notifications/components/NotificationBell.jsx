// frontend/src/features/notifications/components/NotificationBell.jsx
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { useUserStore } from '../../user/hooks/useUser';
import { useUnreadCount } from '../hooks/useUnreadCount';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const { user } = useUserStore();
  const { data: unreadCount = 0 } = useUnreadCount();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  if (!user) return null;

  return (
    <div className="relative z-10">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        type="button"
        className="relative"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center px-1 pointer-events-none">
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
