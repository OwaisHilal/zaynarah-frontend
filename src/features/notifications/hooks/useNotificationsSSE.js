// frontend/src/features/notifications/hooks/useNotificationsSSE.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  connectNotificationsSSE,
  disconnectNotificationsSSE,
} from '../services/notificationsSse';
import { useUserStore } from '@/features/user/hooks/useUser';

export default function useNotificationsSSE() {
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      disconnectNotificationsSSE();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    connectNotificationsSSE({
      token,
      onMessage: (event) => {
        if (event?.type !== 'notification:new') return;

        const notification = event.payload;

        queryClient.setQueryData(['notifications'], (data) => {
          if (!data) return data;

          const exists = data.pages.some((page) =>
            page.some((n) => n.id === notification.id)
          );

          if (exists) return data;

          return {
            ...data,
            pages: [[notification, ...data.pages[0]], ...data.pages.slice(1)],
          };
        });

        queryClient.invalidateQueries({
          queryKey: ['notifications', 'unread-count'],
        });
      },
    });

    return () => disconnectNotificationsSSE();
  }, [user, queryClient]);
}
