// frontend/src/features/notifications/hooks/useNotifications.js
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../services/notificationsApi';

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) => fetchNotifications({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
  });
}
