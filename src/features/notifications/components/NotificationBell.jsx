// src/features/notifications/components/NotificationBell.jsx
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useUserStore } from '../../user/hooks/useUser';
import { useUnreadCount } from '../hooks/useUnreadCount';
import NotificationDropdown from './NotificationDropdown';
import { useNotificationsUIStore } from '@/stores/notifications';

export default function NotificationBell() {
  const { user } = useUserStore();
  const unreadCount = useUnreadCount();
  const { dropdownOpen, openDropdown, closeDropdown } =
    useNotificationsUIStore();
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
          dropdownOpen ? closeDropdown() : openDropdown();
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center px-1 pointer-events-none">
            {unreadCount}
          </span>
        )}
      </Button>

      {dropdownOpen && (
        <NotificationDropdown triggerRef={buttonRef} onClose={closeDropdown} />
      )}
    </div>
  );
}
