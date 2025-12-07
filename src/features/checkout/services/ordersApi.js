// src/features/checkout/services/ordersApi.js
import axios from 'axios';

const API_BASE = '/api/orders';

export const createOrder = async (orderData, token) => {
  const res = await axios.post(API_BASE, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getOrderById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
