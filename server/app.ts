import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import expensesRoute from './routes/expenses-route';
import authRoute from './routes/auth-route';

const app = new Hono();

app.use('*', logger());

export const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/', authRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
