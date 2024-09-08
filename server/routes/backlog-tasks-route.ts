import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTasksTable } from '../db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { createBacklogTaskSchema, updateBacklogTaskSchema } from '../validation/backlog-tasks.schema';

const backlogTasksRoute = new Hono()
  .post('/', zValidator('json', createBacklogTaskSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const data = await c.req.valid('json');
    const backlogTask = createBacklogTaskSchema.parse(data);

    const newBacklogTask = {
      ...backlogTask,
      userId: user.id,
    };

    const inserted = await db.insert(backlogTasksTable).values(newBacklogTask).returning();
    return c.json(inserted);
  })
  .put('/:id', zValidator('json', updateBacklogTaskSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const data = await c.req.valid('json');
    const backlogTask = updateBacklogTaskSchema.parse(data);

    const updated = await db
      .update(backlogTasksTable)
      .set(backlogTask)
      .where(and(eq(backlogTasksTable.id, id), eq(backlogTasksTable.userId, user.id)))
      .returning();

    return c.json(updated);
  })
  .get('/', authMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const tasks = await db
      .select()
      .from(backlogTasksTable)
      .where(eq(backlogTasksTable.userId, user.id))
      .orderBy(desc(backlogTasksTable.createdAt));

    return ctx.json([
      { name: 'Default', tasks },
      { name: 'Work', tasks },
      { name: 'Personal', tasks },
    ]);
  })
  .get('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const task = await db
      .select()
      .from(backlogTasksTable)
      .where(and(eq(backlogTasksTable.id, id), eq(backlogTasksTable.userId, user.id)))
      .limit(1);

    if (!task.length) {
      return c.notFound();
    }
    return c.json(task[0]);
  })
  .delete('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const task = db
      .select()
      .from(backlogTasksTable)
      .where(and(eq(backlogTasksTable.id, id), eq(backlogTasksTable.userId, user.id)))
      .limit(1);

    if (!task) {
      return c.notFound();
    }
    const deleted = await db.delete(backlogTasksTable).where(eq(backlogTasksTable.id, id)).returning();
    return c.json(deleted);
  });

export default backlogTasksRoute;
