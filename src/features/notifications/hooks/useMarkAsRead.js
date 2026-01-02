// frontend/src/features/notifications/hooks/useMarkAsRead.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationsApi';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const markOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['notifications'], (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) =>
            page.map((n) => (n._id === id ? { ...n, readAt: new Date() } : n))
          ),
        };
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) =>
            page.map((n) => ({ ...n, readAt: new Date() }))
          ),
        };
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });

  return {
    markOne,
    markAll,
  };
}
