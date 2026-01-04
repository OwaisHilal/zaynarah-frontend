// frontend/src/features/notifications/hooks/useNotificationsSSE.js
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  connectNotificationsSSE,
  disconnectNotificationsSSE,
} from '../services/notificationsSse';
import { useUserStore } from '@/features/user/hooks/useUser';

export default function useNotificationsSSE() {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      connectedRef.current = false;
      disconnectNotificationsSSE();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    if (connectedRef.current) return;
    connectedRef.current = true;

    connectNotificationsSSE({
      token,
      onMessage: (event) => {
        if (event?.type !== 'notification:new') return;

        const notification = event.payload;

        queryClient.setQueryData(['notifications'], (data) => {
          if (!data) return data;

          const exists = data.pages.some((page) =>
            page.some((n) => n._id === notification._id)
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

    return () => {
      connectedRef.current = false;
      disconnectNotificationsSSE();
    };
  }, [user?.id]);
}
