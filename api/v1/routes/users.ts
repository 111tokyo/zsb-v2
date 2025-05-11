import { Context } from 'hono';
import { selfbot } from '../../../main';

const execute = async (c: Context) => {
  const usersArray = Array.from(selfbot.selfbotUsers.keys());
  return c.json({
    success: true,
    status: 200,
    stringStatus: 'success',
    code: 'SUCCESS',
    message: 'ok',
    result: usersArray,
  });
};

export { execute };
