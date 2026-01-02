// frontend/src/features/notifications/pages/NotificationsPage.jsx
import { useEffect } from 'react';
import { useUserStore } from '../../user/hooks/useUser';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import NotificationItem from '../components/NotificationItem';
import NotificationsEmpty from '../components/NotificationsEmpty';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { user } = useUserStore();
  const { data, fetchNextPage, hasNextPage } = useNotifications();
  const { markOne, markAll } = useMarkAsRead();

  const items = data?.pages?.flat() ?? [];
  const hasNotifications = items.length > 0;

  if (!user) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-10">
        <NotificationsEmpty
          title="Sign in to view notifications"
          description="You need to be logged in to see your updates."
        />
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>

        {hasNotifications && (
          <Button variant="outline" size="sm" onClick={() => markAll.mutate()}>
            Mark all as read
          </Button>
        )}
      </header>

      <div className="space-y-3">
        {hasNotifications ? (
          items.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={(id) => markOne.mutate(id)}
            />
          ))
        ) : (
          <NotificationsEmpty
            title="Nothing new"
            description="We’ll notify you when something important happens."
          />
        )}
      </div>

      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
