import { type UserType } from '@kinde-oss/kinde-typescript-sdk';
import { createMiddleware } from 'hono/factory';
import { getSessionManager, kindeClient } from '../auth/kinde';

type Env = {
  Variables: {
    user: UserType;
  };
};

export const authMiddleware = createMiddleware<Env>(async (ctx, next) => {
  try {
    const sessionManager = getSessionManager(ctx);
    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);
    if (!isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = await kindeClient.getUserProfile(sessionManager);
    ctx.set('user', user);
    await next();
  } catch (error) {
    console.error(error);
    return ctx.json({ message: 'Unauthorized' }, { status: 401 });
  }
});
