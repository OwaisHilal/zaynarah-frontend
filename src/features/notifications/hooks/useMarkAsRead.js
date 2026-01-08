// src/features/notifications/hooks/useMarkAsRead.js
import { useMutation } from '@tanstack/react-query';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationsApi';
import { useNotificationsDomainStore } from '@/stores/notifications';

export function useMarkAsRead() {
  const markOneRead = useNotificationsDomainStore((s) => s.markOneRead);
  const markAllRead = useNotificationsDomainStore((s) => s.markAllRead);

  const markOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_, id) => markOneRead(id),
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => markAllRead(),
  });

  return { markOne, markAll };
}
