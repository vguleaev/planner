import type { InferSelectModel } from 'drizzle-orm';
import { index, pgTable, text, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { BACKLOG_TASK_STATUS } from '../constants/backlog-task-status.const';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

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
    groupId: uuid('group_id')
      .notNull()
      .references(() => backlogTaskGroupTable.id),
    priority: priorityEnum('priority').notNull().default('MEDIUM'),
    dueDate: timestamp('due_date', { precision: 6, withTimezone: true, mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      userIndex: index('backlog_task_userId_idx').on(table.userId),
      groupIndex: index('backlog_task_groupId_idx').on(table.groupId),
    };
  }
);

export type BacklogTask = InferSelectModel<typeof backlogTasksTable>;

export const backlogTaskGroupTable = pgTable(
  'backlog_task_groups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      userIndex: index('backlog_task_group_userId_idx').on(table.userId),
    };
  }
);

export type BacklogTaskGroup = InferSelectModel<typeof backlogTaskGroupTable>;
