import z from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  amount: z.number().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date must be a valid ISO date',
  }),
});
