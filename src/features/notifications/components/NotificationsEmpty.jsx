//frontend/src/features/notifications/components/NotificationsEmpty.jsx
import { Bell } from 'lucide-react';

export default function NotificationsEmpty({
  title = 'No notifications',
  description = 'You’re all caught up for now.',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bell size={18} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
