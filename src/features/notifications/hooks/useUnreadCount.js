import { useNotificationsDomainStore } from '@/stores/notifications';

export function useUnreadCount() {
  return useNotificationsDomainStore((s) => s.unreadCount());
}
