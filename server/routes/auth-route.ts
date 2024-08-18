import { Hono } from 'hono';
import { kindeClient, getSessionManager } from '../auth/kinde';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRoute = new Hono()
  .get('/login', async (ctx) => {
    const sessionManager = getSessionManager(ctx);
    const loginUrl = await kindeClient.login(sessionManager);
    return ctx.redirect(loginUrl.toString());
  })
  .get('/register', async (ctx) => {
    const sessionManager = getSessionManager(ctx);
    const registerUrl = await kindeClient.register(sessionManager);
    return ctx.redirect(registerUrl.toString());
  })
  .get('/callback', async (ctx) => {
    const sessionManager = getSessionManager(ctx);
    const url = new URL(ctx.req.url);
    await kindeClient.handleRedirectToApp(sessionManager, url);
    return ctx.redirect('/');
  })
  .get('/logout', async (ctx) => {
    const sessionManager = getSessionManager(ctx);
    const logoutUrl = await kindeClient.logout(sessionManager);
    return ctx.redirect(logoutUrl.toString());
  })
  .get('/me', authMiddleware, async (ctx) => {
    const user = ctx.get('user');
    return ctx.json(user);
  });

export default authRoute;
