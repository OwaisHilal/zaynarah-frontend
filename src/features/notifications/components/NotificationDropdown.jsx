// frontend/src/features/notifications/components/NotificationDropdown.jsx
import { useEffect, useRef } from 'react';
import { useNotificationsStore } from '../store/notificationsStore';
import NotificationItem from './NotificationItem';
import { Link } from 'react-router-dom';

export default function NotificationDropdown({ onClose, triggerRef }) {
  const ref = useRef(null);
  const { items, loadNotifications, markRead } = useNotificationsStore();

  useEffect(() => {
    loadNotifications({ reset: true });
    ref.current?.focus();

    const onKey = (e) => e.key === 'Escape' && onClose();
    const onClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !triggerRef?.current?.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
      triggerRef?.current?.focus();
    };
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label="Notifications"
      className="
        absolute right-0 mt-2 w-96 max-h-[480px]
        rounded-2xl border bg-background shadow-xl
        animate-in fade-in slide-in-from-top-2
        focus:outline-none
      "
    >
      <header className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </header>

      <div className="p-2 space-y-2 overflow-y-auto">
        {items.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground text-center">
            You’re all caught up
          </div>
        )}

        {items.slice(0, 8).map((n) => (
          <div key={n._id} className="line-clamp-2">
            <NotificationItem notification={n} onRead={markRead} />
          </div>
        ))}
      </div>
      <div className="border-t px-4 py-3">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block text-center text-sm font-medium text-primary hover:underline"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
