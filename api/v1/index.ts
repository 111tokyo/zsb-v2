import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import config from '../../src/config';

export const api = () => {
  const app = new Hono();

  app.use(prettyJSON());
  app.use('/api/*', cors());

  serve({
    fetch: app.fetch,
    port: config.api.port,
  });

  app.notFound(c => {
    return c.json({
      success: false,
      status: 404,
      message: 'Not Found',
      result: null,
    });
  });

  app.post('/api/*', async (c: Context) => {
    const route = await import('./routes/' + c.req.path.split('/api/v1/')[1]);
    return await route.execute(c);
  });

  console.log(`[INFO] API running on http://localhost:${config.api.port}`);
};
