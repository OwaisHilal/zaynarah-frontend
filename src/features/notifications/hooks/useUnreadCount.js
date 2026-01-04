// frontend/src/features/notifications/hooks/useUnreadCount.js
import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '../services/notificationsApi';
import { useUserStore } from '@/features/user/hooks/useUser';

export function useUnreadCount() {
  const { user } = useUserStore();
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 30000,
    enabled: !!user,
  });
}
