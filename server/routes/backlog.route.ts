import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTaskGroupTable, backlogTasksTable } from '../db/schema';
import { asc, desc, eq } from 'drizzle-orm';

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
  return ctx.json({
    groups: groupsWithTasks,
  });
});

export default backlogRoute;
