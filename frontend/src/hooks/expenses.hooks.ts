import { api } from '@/lib/api';
import queryClient from '@/query-client/query-client';
import { CreateExpense } from '@server/validation/expenses.schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from './use-toast';

const fetchExpenses = async () => {
  const response = await api.expenses.$get();
  return response.json();
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 5,
  });
};

const createExpense = async ({ newExpense }: { newExpense: CreateExpense }) => {
  const res = await api.expenses.$post({ json: newExpense });
  return res.json();
};

export const useCreateExpense = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Success!',
        description: 'You have successfully created a new expense.',
      });
    },
  });
};

const deleteExpense = async ({ id }: { id: number }) => {
  await api.expenses[':id'].$delete({ param: { id: id.toString() } });
};

export const useDeleteExpense = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Success!',
        description: 'You have successfully deleted an expense.',
      });
    },
  });
};