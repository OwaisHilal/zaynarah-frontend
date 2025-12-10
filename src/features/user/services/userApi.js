// src/features/user/services/userApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

/* ================================
   AUTH (Login + Signup)
================================ */
export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/login`, data);
  return res.data;
  // expected → { token, user }
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/register`, data);
  return res.data;
  // expected → { token, user }
};

/* ================================
   USER PROFILE
================================ */
export const getProfile = async () => {
  const res = await axios.get(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axios.put(`${API_BASE}/users/profile`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ================================
   ADDRESSES
================================ */
export const getAddresses = async () => {
  const res = await axios.get(`${API_BASE}/users/addresses`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const addAddress = async (addressData) => {
  const res = await axios.post(`${API_BASE}/users/addresses`, addressData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateAddress = async (id, addressData) => {
  const res = await axios.put(
    `${API_BASE}/users/addresses/${id}`,
    addressData,
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await axios.delete(`${API_BASE}/users/addresses/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ================================
   USER ORDERS
================================ */
export const getMyOrders = async () => {
  const res = await axios.get(`${API_BASE}/users/my-orders`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getSingleUserOrder = async (orderId) => {
  const res = await axios.get(`${API_BASE}/users/my-orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
