import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const expenseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3),
  amount: z.number().positive(),
});

export type Expense = z.infer<typeof expenseSchema>;

const createExpenseSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, name: 'Rent', amount: 1000 },
  { id: 2, name: 'Food', amount: 200 },
  { id: 3, name: 'Gas', amount: 50 },
];

const expensesRoute = new Hono();

expensesRoute.post('/', zValidator('form', createExpenseSchema), async (c) => {
  const data = await c.req.valid('form');
  const expense = createExpenseSchema.parse(data);

  fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense });

  return c.json(expense);
});

expensesRoute.get('/', (c) => {
  return c.json(fakeExpenses);
});

expensesRoute.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ message: 'Id must be a number' });
  }
  const expense = fakeExpenses.find((e) => e.id === id);

  if (!expense) {
    return c.notFound();
  }

  return c.json(expense);
});

expensesRoute.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ message: 'Id must be a number' });
  }
  const index = fakeExpenses.findIndex((e) => e.id === id);
  if (index === -1) {
    return c.notFound();
  }

  const deleted = fakeExpenses.splice(index, 1)[0];
  return c.json(deleted);
});

export default expensesRoute;
