// frontend/src/features/notifications/components/NotificationDropdown.jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAsRead } from '../hooks/useMarkAsRead';

export default function NotificationDropdown({ onClose, triggerRef }) {
  const ref = useRef(null);
  const { data, fetchNextPage } = useNotifications();
  const { markOne } = useMarkAsRead();

  const items = data?.pages?.flat() ?? [];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

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
    };
  }, [onClose, triggerRef]);

  return (
    <div
      ref={ref}
      className="
        absolute right-0 mt-2 w-80 sm:w-96 max-h-[480px]
        rounded-2xl border bg-white shadow-2xl z-[100]
        flex flex-col overflow-hidden
        animate-in fade-in slide-in-from-top-2
      "
    >
      <header className="px-4 py-3 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </header>

      <div className="p-2 space-y-1 overflow-y-auto bg-white">
        {items.length === 0 ? (
          <div className="p-10 text-sm text-muted-foreground text-center">
            You’re all caught up
          </div>
        ) : (
          items.slice(0, 8).map((n) => (
            <div key={n.id} className="block w-full text-left">
              <NotificationItem
                notification={n}
                onRead={(id) => markOne.mutate(id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="border-t px-4 py-3 bg-slate-50">
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
