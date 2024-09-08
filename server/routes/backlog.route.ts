import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTaskGroupTable, backlogTasksTable, type BacklogTask, type BacklogTaskGroup } from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

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

const backlogRoute = new Hono().get('/', authMiddleware, async (ctx) => {
  const user = ctx.get('user');
  const filter = ctx.req.query('filter');

  console.log('filter', filter);

  const groups = await db
    .select()
    .from(backlogTaskGroupTable)
    .where(eq(backlogTaskGroupTable.userId, user.id))
    .orderBy(asc(backlogTaskGroupTable.createdAt));

  const tasks = await db
    .select()
    .from(backlogTasksTable)
    .where(eq(backlogTasksTable.userId, user.id))
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
