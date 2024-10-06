import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTaskGroupTable, backlogTasksTable, type BacklogTask, type BacklogTaskGroup } from '../db/schema';
import { and, asc, desc, eq, gte } from 'drizzle-orm';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';
import type { ValueOf } from 'ts-essentials';
import { BACKLOG_TASK_CREATED_FILTER } from '../constants/backlog-task-created-filter';
import dayjs from 'dayjs';

export type GetBacklogResponse = {
  groups: BacklogTaskGroupWithTasks[];
};

export type BacklogTaskGroupWithTasks = BacklogTaskGroup & {
  tasks: BacklogTask[];
};

const priorityMap = {
  [BACKLOG_TASK_PRIORITY.HIGH]: 1,
  [BACKLOG_TASK_PRIORITY.MEDIUM]: 2,
  [BACKLOG_TASK_PRIORITY.LOW]: 3,
};

const getCreatedDateFilter = (createdFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) => {
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
    default:
      throw new Error('Invalid created filter');
  }
};

const backlogRoute = new Hono().get('/', authMiddleware, async (ctx) => {
  const user = ctx.get('user');
  const createdFilter = ctx.req.query('created') as ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>;

  const groups = await db
    .select()
    .from(backlogTaskGroupTable)
    .where(eq(backlogTaskGroupTable.userId, user.id))
    .orderBy(asc(backlogTaskGroupTable.createdAt));

  const tasks = await db
    .select()
    .from(backlogTasksTable)
    .where(and(eq(backlogTasksTable.userId, user.id), getCreatedDateFilter(createdFilter)))
    .orderBy(desc(backlogTasksTable.createdAt));

  const sortedTasks = tasks.sort((a, b) => {
    return priorityMap[a.priority] - priorityMap[b.priority];
  });

  const groupsWithTasks = groups.map((group) => {
    return {
      ...group,
      tasks: sortedTasks.filter((task) => task.groupId === group.id),
    };
  });
  return ctx.json<GetBacklogResponse>({
    groups: groupsWithTasks,
  });
});

export default backlogRoute;
