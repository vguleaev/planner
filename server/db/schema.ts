import type { InferSelectModel } from 'drizzle-orm';
import { index, serial, numeric, pgTable, text, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';

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

const statusEnum = pgEnum('status', ['COMPLETED', 'NOT_COMPLETED', 'WONT_DO']);
const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH']);

export const backlogTasksTable = pgTable(
  'backlog_tasks',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    status: statusEnum('status').notNull().default('NOT_COMPLETED'),
    priority: priorityEnum('priority').notNull().default('MEDIUM'),
    dueDate: date('due_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      userIndex: index('backlog_task_userId_idx').on(table.userId),
    };
  }
);

export type BacklogTask = InferSelectModel<typeof backlogTasksTable>;
