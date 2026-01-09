// frontend/src/features/orders/services/ordersApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchMyOrders({ page = 1, limit = 10, status } = {}) {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);

  const res = await api.get(`/orders/my-orders?${params.toString()}`);
  return res.data || [];
}

export async function fetchOrderById(orderId) {
  if (!orderId) throw new Error('Order ID is required');
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
}

export async function downloadOrderInvoice(orderId) {
  if (!orderId) throw new Error('Order ID is required');

  const res = await api.get(`/orders/${orderId}/invoice`, {
    responseType: 'text',
  });

  return res.data;
}
