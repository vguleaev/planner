import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { expensesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3),
  amount: z.number().positive(),
});

export type Expense = z.infer<typeof expenseSchema>;

const createExpenseSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Rent', amount: 1000 },
  { id: 2, title: 'Food', amount: 200 },
  { id: 3, title: 'Gas', amount: 50 },
];

const expensesRoute = new Hono()
  .post('/', zValidator('json', createExpenseSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const data = await c.req.valid('json');
    const expense = createExpenseSchema.parse(data);

    const newExpense = {
      title: expense.title,
      amount: expense.amount.toFixed(2),
      userId: user.id,
    };

    const inserted = await db.insert(expensesTable).values(newExpense).returning();
    return c.json(inserted);
  })
  .get('/', authMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id));
    return ctx.json(expenses);
  })
  .get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ message: 'Id must be a number' }, 400);
    }
    const expense = await db.select().from(expensesTable).where(eq(expensesTable.id, id)).limit(1);
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .delete('/:id', (c) => {
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
