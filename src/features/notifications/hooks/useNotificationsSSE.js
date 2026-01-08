// src/features/notifications/hooks/useNotificationsSSE.js
import { useEffect, useRef } from 'react';
import {
  connectNotificationsSSE,
  disconnectNotificationsSSE,
} from '../services/notificationsSse';
import { useUserStore } from '@/features/user/hooks/useUser';
import { useNotificationsDomainStore } from '@/stores/notifications';

export default function useNotificationsSSE() {
  const { user } = useUserStore();
  const insertFromSSE = useNotificationsDomainStore((s) => s.insertFromSSE);
  const reset = useNotificationsDomainStore((s) => s.reset);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      connectedRef.current = false;
      disconnectNotificationsSSE();
      reset();
      return;
    }

    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token || connectedRef.current) return;

    connectedRef.current = true;

    connectNotificationsSSE({
      token,
      onMessage: (event) => {
        if (event?.type === 'notification:new') {
          insertFromSSE(event.payload);
        }
      },
    });

    return () => {
      connectedRef.current = false;
      disconnectNotificationsSSE();
    };
  }, [user?._id]);
}
