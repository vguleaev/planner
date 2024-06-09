import app from './app';

const port = process.env.PORT || 3000;

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
