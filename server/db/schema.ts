import type { InferSelectModel } from 'drizzle-orm';
import { index, serial, numeric, pgTable, text, timestamp, date } from 'drizzle-orm/pg-core';

export const expensesTable = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      userIndex: index('userId_idx').on(table.userId),
    };
  }
);

export type Expense = InferSelectModel<typeof expensesTable>;
