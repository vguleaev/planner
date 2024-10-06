import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware';
import type { ValueOf } from 'ts-essentials';
import { BACKLOG_TASK_CREATED_FILTER } from '../constants/backlog-task-created-filter';
import { getBacklogTasks, type BacklogTaskGroupWithTasks } from '../services/backlog.service';

export type GetBacklogResponse = {
  groups: BacklogTaskGroupWithTasks[];
};

const backlogRoute = new Hono().get('/', authMiddleware, async (ctx) => {
  const user = ctx.get('user');
  const createdFilter = ctx.req.query('created') as ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>;

  const groupsWithTasks = await getBacklogTasks(user, createdFilter);

  return ctx.json<GetBacklogResponse>({
    groups: groupsWithTasks,
  });
});

export default backlogRoute;
