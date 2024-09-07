import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { db } from '../db/db';
import { backlogTaskGroupTable } from '../db/schema';
import { desc, eq, and, count } from 'drizzle-orm';
import { createBacklogTaskGroupSchema, updateBacklogTaskGroupSchema } from '../validation/backlog-task-groups.schema';

const backlogTaskGroupsRoute = new Hono()
  .post('/', zValidator('json', createBacklogTaskGroupSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const data = await c.req.valid('json');
    const group = createBacklogTaskGroupSchema.parse(data);

    const groupsCount = await db
      .select({ count: count() })
      .from(backlogTaskGroupTable)
      .where(eq(backlogTaskGroupTable.userId, user.id));

    if (groupsCount[0].count >= 3) {
      return c.json({ message: 'You can maximum have 3 groups' }, 400);
    }

    const newBacklogTask = {
      ...group,
      userId: user.id,
    };

    const inserted = await db.insert(backlogTaskGroupTable).values(newBacklogTask).returning();
    return c.json(inserted);
  })
  .put('/:id', zValidator('json', updateBacklogTaskGroupSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const data = await c.req.valid('json');
    const payload = updateBacklogTaskGroupSchema.parse(data);

    const updated = await db
      .update(backlogTaskGroupTable)
      .set(payload)
      .where(and(eq(backlogTaskGroupTable.id, id), eq(backlogTaskGroupTable.userId, user.id)))
      .returning();

    return c.json(updated);
  })
  .get('/', authMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const groups = await db
      .select()
      .from(backlogTaskGroupTable)
      .where(eq(backlogTaskGroupTable.userId, user.id))
      .orderBy(desc(backlogTaskGroupTable.createdAt));

    return ctx.json(groups);
  })
  .get('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const group = await db
      .select()
      .from(backlogTaskGroupTable)
      .where(and(eq(backlogTaskGroupTable.id, id), eq(backlogTaskGroupTable.userId, user.id)))
      .limit(1);

    if (!group.length) {
      return c.notFound();
    }
    return c.json(group[0]);
  })
  .delete('/:id', authMiddleware, async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const group = db
      .select()
      .from(backlogTaskGroupTable)
      .where(and(eq(backlogTaskGroupTable.id, id), eq(backlogTaskGroupTable.userId, user.id)))
      .limit(1);

    if (!group) {
      return c.notFound();
    }
    const deleted = await db.delete(backlogTaskGroupTable).where(eq(backlogTaskGroupTable.id, id)).returning();
    return c.json(deleted);
  });

export default backlogTaskGroupsRoute;
