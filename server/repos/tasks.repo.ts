import { and, desc, eq, gte } from 'drizzle-orm';
import type { ValueOf } from 'ts-essentials';
import type { UserType } from '@kinde-oss/kinde-typescript-sdk';
import { db } from '../db/db';
import { backlogTasksTable } from '../db/schema';
import { BACKLOG_TASK_CREATED_FILTER } from '../constants/backlog-task-created-filter';
import dayjs from 'dayjs';

export async function getTasksByCreatedDate(
  user: UserType,
  createdFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>
) {
  return await db
    .select()
    .from(backlogTasksTable)
    .where(and(eq(backlogTasksTable.userId, user.id), getCreatedDateFilter(createdFilter)))
    .orderBy(desc(backlogTasksTable.createdAt));
}

function getCreatedDateFilter(createdFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) {
  switch (createdFilter) {
    case BACKLOG_TASK_CREATED_FILTER.TODAY:
      return gte(backlogTasksTable.createdAt, dayjs().startOf('day').toISOString());
    case BACKLOG_TASK_CREATED_FILTER.LAST_7_DAYS:
      return gte(backlogTasksTable.createdAt, dayjs().subtract(7, 'day').toISOString());
    case BACKLOG_TASK_CREATED_FILTER.LAST_MONTH:
      return gte(backlogTasksTable.createdAt, dayjs().subtract(1, 'month').toISOString());
    case BACKLOG_TASK_CREATED_FILTER.LAST_3_MONTHS:
      return gte(backlogTasksTable.createdAt, dayjs().subtract(3, 'month').toISOString());
    case BACKLOG_TASK_CREATED_FILTER.LAST_6_MONTHS:
      return gte(backlogTasksTable.createdAt, dayjs().subtract(6, 'month').toISOString());
    case BACKLOG_TASK_CREATED_FILTER.LAST_YEAR:
      return gte(backlogTasksTable.createdAt, dayjs().subtract(1, 'year').toISOString());
    default:
      throw new Error('Invalid created filter');
  }
}
