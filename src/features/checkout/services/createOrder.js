import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Replace with your backend URL

export async function createOrder({
  address,
  cartItems,
  totalAmount,
  paymentMethod,
}) {
  try {
    const response = await axios.post(`${API_BASE}/orders`, {
      address,
      items: cartItems,
      totalAmount,
      paymentMethod,
    });

    return response.data; // { id, totalAmount, currency, status }
  } catch (err) {
    console.error('Create order failed:', err);
    throw err;
  }
}
