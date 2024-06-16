import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import expensesRoute from './routes/expenses-route';

const app = new Hono();

app.use('*', logger());

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute);

app.get('/test', (c) => {
  return c.json({ message: 'Hello, World!' });
});

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
