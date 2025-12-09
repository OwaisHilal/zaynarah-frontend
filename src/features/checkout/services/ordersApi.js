// src/features/checkout/services/ordersApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const ORDERS_URL = `${API_BASE}/orders`;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(ORDERS_URL, orderData, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Create Order Error:', err);
    throw err;
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await axios.get(`${ORDERS_URL}/${id}`, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Get Order Error:', err);
    throw err;
  }
};
