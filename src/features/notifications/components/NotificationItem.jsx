//frontend/src/features/notifications/components/NotificationItem.jsx

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

function formatTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString();
}

export default function NotificationItem({ notification, onRead }) {
  const unread = !notification.readAt;

  return (
    <Link
      to={notification.actionUrl || '#'}
      onClick={() => unread && onRead(notification._id)}
      className={cn(
        'group block rounded-xl border p-4 transition-all',
        unread
          ? 'bg-muted/40 border-border hover:bg-muted'
          : 'bg-background hover:bg-muted/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-1 h-2.5 w-2.5 rounded-full transition-opacity',
            unread ? 'bg-primary' : 'opacity-0'
          )}
          aria-hidden
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {notification.title}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(notification.createdAt)}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </Link>
  );
}
