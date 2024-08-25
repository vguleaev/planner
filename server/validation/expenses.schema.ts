import z from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  amount: z.number().positive(),
});
