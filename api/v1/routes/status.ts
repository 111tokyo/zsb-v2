import { Context } from 'hono';
import { selfbot } from '../../../main';

const execute = async (c: Context) => {
  return c.json({
    success: true,
    status: 200,
    stringStatus: 'success',
    code: 'SUCCESS',
    message: 'ok',
    result: { userNb: selfbot.userNb, ping: selfbot.ws.ping },
  });
};

export { execute };
