import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import authRoute from './routes/auth-route';
import backlogTasksRoute from './routes/backlog-tasks-route';
import backlogRoute from './routes/backlog.route';
import backlogTaskGroupsRoute from './routes/backlog-task-groups-route';

const app = new Hono();

app.use('*', logger());

export const apiRoutes = app
  .basePath('/api')
  .route('/backlog', backlogRoute)
  .route('/backlog-tasks', backlogTasksRoute)
  .route('/backlog-task-groups', backlogTaskGroupsRoute)
  .route('/', authRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
