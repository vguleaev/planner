import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { expensesTable } from '../db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { createExpenseSchema } from '../validation/expenses.schema';
import { sleep } from 'bun';

const expensesRoute = new Hono()
  .post('/', zValidator('json', createExpenseSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const data = await c.req.valid('json');
    const expense = createExpenseSchema.parse(data);

    const newExpense = {
      title: expense.title,
      amount: expense.amount.toFixed(2),
      date: expense.date,
      userId: user.id,
    };

    const inserted = await db.insert(expensesTable).values(newExpense).returning();
    return c.json(inserted);
  })
  .get('/', authMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt));

    return ctx.json(expenses);
  })
  .get('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ message: 'Id must be a number' }, 400);
    }
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .limit(1);
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .delete('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      c.status(400);
      return c.json({ message: 'Id must be a number' });
    }
    const expense = db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .limit(1);
    if (!expense) {
      return c.notFound();
    }
    const deleted = await db.delete(expensesTable).where(eq(expensesTable.id, id)).returning();
    return c.json(deleted);
  });

export default expensesRoute;
