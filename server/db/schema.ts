import type { InferSelectModel } from 'drizzle-orm';
import { index, serial, numeric, pgTable, text, timestamp, date, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { BACKLOG_TASK_STATUS } from '../constants/backlog-task-status.const';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

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

const statusEnum = pgEnum('status', [
  BACKLOG_TASK_STATUS.NOT_COMPLETED,
  BACKLOG_TASK_STATUS.COMPLETED,
  BACKLOG_TASK_STATUS.WONT_DO,
]);
const priorityEnum = pgEnum('priority', [
  BACKLOG_TASK_PRIORITY.LOW,
  BACKLOG_TASK_PRIORITY.MEDIUM,
  BACKLOG_TASK_PRIORITY.HIGH,
]);

export const backlogTasksTable = pgTable(
  'backlog_tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
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
