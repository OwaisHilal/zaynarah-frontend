{
  /*for mock
   */
}

// src/features/checkout/services/createOrder.js

// Mock order creation without a backend
export async function createOrder({ address, cartItems, totalAmount }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return a mock order object
  return {
    id: 'order_' + Date.now(),
    address,
    cartItems,
    totalAmount,
    currency: 'INR',
    status: 'pending',
  };
}

{
  /*for backend
   */
}

// import axios from 'axios';

// // Replace with your backend API
// const API_BASE = 'http://localhost:5000/api';

// export async function createOrder({ address, cartItems, totalAmount }) {
//   try {
//     const response = await axios.post(`${API_BASE}/orders`, {
//       address,
//       items: cartItems,
//       totalAmount,
//     });

//     return response.data; // { orderId, amount, currency }
//   } catch (err) {
//     console.error('Create order failed:', err);
//     throw err;
//   }
// }
