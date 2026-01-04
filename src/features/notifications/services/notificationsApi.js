// frontend/src/features/notifications/services/notificationsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : null;
};

export const fetchNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const headers = authHeaders();
  if (!headers) return [];

  const res = await axios.get(
    `${API_BASE}/notifications?page=${page}&limit=${limit}`,
    { headers }
  );

  return res.data;
};

export async function fetchUnreadCount() {
  const token = getToken();
  if (!token) return 0;

  const res = await axios.get(`${API_BASE}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.count;
}

export const markNotificationRead = async (id) => {
  const headers = authHeaders();
  if (!headers) return;

  await axios.post(`${API_BASE}/notifications/${id}/read`, {}, { headers });
};

export const markAllNotificationsRead = async () => {
  const headers = authHeaders();
  if (!headers) return;

  await axios.post(`${API_BASE}/notifications/read-all`, {}, { headers });
};
