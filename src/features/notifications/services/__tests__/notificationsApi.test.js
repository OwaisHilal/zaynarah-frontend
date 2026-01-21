// frontend/src/features/notifications/services/__tests__/notificationsApi.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../notificationsApi';

const resetAuth = () => {
  localStorage.clear();
  sessionStorage.clear();
};

describe('notificationsApi — contract behavior', () => {
  beforeEach(() => {
    resetAuth();
  });

  it('fetchNotifications returns empty array when unauthenticated', async () => {
    const res = await fetchNotifications();
    expect(res).toEqual([]);
  });

  it('fetchNotifications returns paginated notifications when authenticated', async () => {
    localStorage.setItem('token', 'x');

    const res = await fetchNotifications({ page: 1, limit: 20 });
    expect(res.length).toBe(20);
    expect(res[0]._id).toContain('n-1');
  });

  it('fetchNotifications supports pagination without crashing', async () => {
    localStorage.setItem('token', 'x');

    const res = await fetchNotifications({ page: 2, limit: 20 });
    expect(res.length).toBe(5);
  });

  it('fetchUnreadCount returns 0 when unauthenticated', async () => {
    const count = await fetchUnreadCount();
    expect(count).toBe(0);
  });

  it('fetchUnreadCount returns backend count when authenticated', async () => {
    localStorage.setItem('token', 'x');

    const count = await fetchUnreadCount();
    expect(count).toBe(3);
  });

  it('markNotificationRead is safe without auth', async () => {
    await expect(markNotificationRead('n1')).resolves.toBeUndefined();
  });

  it('markNotificationRead succeeds with auth', async () => {
    localStorage.setItem('token', 'x');
    await expect(markNotificationRead('n1')).resolves.toBeUndefined();
  });

  it('markAllNotificationsRead is safe without auth', async () => {
    await expect(markAllNotificationsRead()).resolves.toBeUndefined();
  });

  it('markAllNotificationsRead succeeds with auth', async () => {
    localStorage.setItem('token', 'x');
    await expect(markAllNotificationsRead()).resolves.toBeUndefined();
  });
});
