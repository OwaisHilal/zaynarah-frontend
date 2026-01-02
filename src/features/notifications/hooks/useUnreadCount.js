// frontend/src/features/notifications/hooks/useUnreadCount.js
import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '../services/notificationsApi';

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 30000,
  });
}
