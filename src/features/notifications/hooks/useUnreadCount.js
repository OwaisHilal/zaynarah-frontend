// frontend/src/features/notifications/hooks/useUnreadCount.js
import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '../services/notificationsApi';
import { useUserStore } from '@/features/user/hooks/useUser';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export function useUnreadCount() {
  const { user } = useUserStore();
  const token = getToken();

  return useQuery({
    queryKey: ['notifications', 'unread-count', user?._id || null],
    queryFn: fetchUnreadCount,
    enabled: Boolean(user && token),
    staleTime: 30000,
    cacheTime: 0,
    retry: false,
  });
}
