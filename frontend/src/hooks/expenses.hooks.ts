import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const fetchExpenses = async () => {
  const response = await api.expenses.$get();
  const data = await response.json();
  return data;
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 5,
  });
};
