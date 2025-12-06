// Dummy fetch function
export const fetchUserOrders = async () => {
  await new Promise((res) => setTimeout(res, 500));
  return [
    {
      id: 101,
      date: '2025-12-01',
      status: 'Delivered',
      total: 3499,
      items: [
        { name: 'Premium Abaya', qty: 1, price: 2499 },
        { name: 'Hijab Set', qty: 1, price: 999 },
      ],
    },
    {
      id: 102,
      date: '2025-11-25',
      status: 'Shipped',
      total: 1999,
      items: [{ name: 'Black Jilbab', qty: 1, price: 1999 }],
    },
    {
      id: 103,
      date: '2025-11-18',
      status: 'Processing',
      total: 2499,
      items: [{ name: 'Luxury Abaya', qty: 1, price: 2499 }],
    },
  ];
};
