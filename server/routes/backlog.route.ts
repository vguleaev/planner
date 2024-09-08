import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTaskGroupTable, backlogTasksTable, type BacklogTask, type BacklogTaskGroup } from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';

export type GetBacklogResponse = {
  groups: BacklogTaskGroupWithTasks[];
};

export type BacklogTaskGroupWithTasks = BacklogTaskGroup & {
  tasks: BacklogTask[];
};

const backlogRoute = new Hono().get('/', authMiddleware, async (ctx) => {
  const user = ctx.get('user');

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

  const groupsWithTasks = groups.map((group) => {
    return {
      ...group,
      tasks: tasks.filter((task) => task.groupId === group.id),
    };
  });
  return ctx.json<GetBacklogResponse>({
    groups: groupsWithTasks,
  });
});

export default backlogRoute;
