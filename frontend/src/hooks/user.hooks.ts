import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const getCurrentUser = async () => {
  const response = await api.me.$get();
  const data = await response.json();
  return data;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });
};
