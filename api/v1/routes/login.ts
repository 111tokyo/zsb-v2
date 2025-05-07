import { Context } from 'hono';
import SelfbotUser from '../../../src/classes/SelfbotUser';

const execute = async (c: Context) => {
  const body = await c.req.json();
  const token = body.token;

  const newUser = await new SelfbotUser().login(token);

  if (!newUser) {
    return c.json({
      success: true,
      status: 400,
      stringStatus: 'success',
      code: 'INVALID_TOKEN',
      message: 'please provide a valid token',
      result: null,
    });
  } else {
    return c.json({
      success: true,
      status: 200,
      stringStatus: 'success',
      code: 'LOGIN_SUCCESS',
      message: 'invalid token',
      result: null,
    });
  }
};

export { execute };
