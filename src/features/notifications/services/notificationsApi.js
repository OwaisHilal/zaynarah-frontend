//frontend/src/features/notifications/services/notificationsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const res = await axios.get(
    `${API_BASE}/notifications?page=${page}&limit=${limit}`,
    { headers: authHeaders() }
  );
  return res.data;
};

export const fetchUnreadCount = async () => {
  const res = await axios.get(`${API_BASE}/notifications/unread-count`, {
    headers: authHeaders(),
  });
  return res.data.count;
};

export const markNotificationRead = async (id) => {
  await axios.post(
    `${API_BASE}/notifications/${id}/read`,
    {},
    { headers: authHeaders() }
  );
};

export const markAllNotificationsRead = async () => {
  await axios.post(
    `${API_BASE}/notifications/read-all`,
    {},
    { headers: authHeaders() }
  );
};
