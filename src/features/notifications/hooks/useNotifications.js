// src/features/notifications/hooks/useNotifications.js
import { useEffect } from 'react';
import { fetchNotifications } from '../services/notificationsApi';
import { useNotificationsDomainStore } from '@/stores/notifications';

export function useNotifications() {
  const { items, page, hasMore, hydrated, hydrate, append } =
    useNotificationsDomainStore();

  useEffect(() => {
    if (hydrated) return;

    const loadAll = async () => {
      let currentPage = 1;
      let all = [];

      while (true) {
        const res = await fetchNotifications({ page: currentPage });
        all = [...all, ...res];
        if (res.length < 20) break;
        currentPage++;
      }

      hydrate(all);
    };

    loadAll();
  }, [hydrated, hydrate]);

  const fetchNextPage = async () => {
    if (!hasMore) return;
    const res = await fetchNotifications({ page });
    append(res);
  };

  return {
    items,
    hasMore,
    fetchNextPage,
  };
}
