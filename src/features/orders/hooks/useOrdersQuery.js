/* frontend/src/features/orders/hooks/useOrdersQuery.js */
import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders } from '../services/ordersApi';

export function useOrdersQuery({ page = 1, limit = 10, status } = {}) {
  return useQuery({
    queryKey: ['orders', { page, limit, status }],
    queryFn: () => fetchMyOrders({ page, limit, status }),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });
}
