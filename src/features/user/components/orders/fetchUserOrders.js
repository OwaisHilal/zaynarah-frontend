//src/features/user/components/orders/fetchUserOrders.jsx
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const fetchUserOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  const res = await axios.get(`${API_BASE}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return (res.data || []).map((o) => ({
    id: o._id,
    date: new Date(o.createdAt).toLocaleDateString(),
    status: o.status,
    total: o.cartTotal?.grand || 0,
    paymentMethod: o.paymentMethod,
    items: (o.items || []).map((i) => ({
      name: i.title,
      qty: i.qty,
      price: i.price,
    })),
  }));
};
