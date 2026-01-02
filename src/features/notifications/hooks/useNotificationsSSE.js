// frontend/src/features/notifications/hooks/useNotificationsSSE.js
import { useEffect } from 'react';
import {
  connectNotificationsSSE,
  disconnectNotificationsSSE,
} from '../services/notificationsSse';
import { useNotificationsStore } from '../store/notificationsStore';
import { useAdminNotificationsStore } from '@/features/admin/stores/adminNotificationsStore';
import { useUserStore } from '@/features/user/hooks/useUser';

export default function useNotificationsSSE() {
  const { user } = useUserStore();
  const pushUserNotification = useNotificationsStore((s) => s.pushNotification);
  const pushAdminNotification = useAdminNotificationsStore(
    (s) => s.pushNotification
  );

  useEffect(() => {
    // 1. If no user, kill connection and exit
    if (!user) {
      disconnectNotificationsSSE();
      return;
    }

    // 2. Double check token availability
    const token = localStorage.getItem('token');
    if (!token) return;

    // 3. Connect
    connectNotificationsSSE({
      token,
      onMessage: (event) => {
        if (event?.type !== 'notification:new') return;
        const notification = event.payload;

        if (user.role === 'admin') {
          pushAdminNotification(notification);
        } else {
          pushUserNotification(notification);
        }
      },
    });

    return () => disconnectNotificationsSSE();
  }, [user, pushUserNotification, pushAdminNotification]);
}
