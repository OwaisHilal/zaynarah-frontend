///frontend/src/features/notifications/pages/NotificationsPage.jsx
import { useEffect } from 'react';
import { useNotificationsStore } from '../store/notificationsStore';
import NotificationItem from '../components/NotificationItem';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { items, loadNotifications, markRead, markAllRead } =
    useNotificationsStore();

  useEffect(() => {
    loadNotifications({ reset: true });
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark all as read
        </Button>
      </header>

      <div className="space-y-3">
        {items.map((n) => (
          <NotificationItem key={n._id} notification={n} onRead={markRead} />
        ))}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        )}
      </div>
    </section>
  );
}
