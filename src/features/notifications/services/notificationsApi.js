// frontend/src/features/notifications/services/notificationsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : null;
};

export const fetchNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const headers = authHeaders();
  if (!headers) throw new Error('Unauthorized');
  const res = await axios.get(
    `${API_BASE}/notifications?page=${page}&limit=${limit}`,
    { headers }
  );
  return res.data;
};

export async function fetchUnreadCount() {
  try {
    const res = await axios.get(`${API_BASE}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.data.count;
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw err;
  }
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
