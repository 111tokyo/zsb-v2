import Selfbot from './src/classes/Selfbot';
import SelfbotUser from './src/classes/SelfbotUser';
import config from './src/config';

export const selfbot = new Selfbot();

(async () => {
  const loginResult = await selfbot.login(config.clientToken);

  if (loginResult === 'INVALID_TOKEN') {
    console.error('[ERROR] Selfbot login failed!');
    process.exit(1);
  }

  const errorHandler = (error: Error) => {
    const skippedErrors = [
      'Unknown interaction',
      'Unknown Message',
      'Interaction has already been acknowledged.',
    ];

    if (skippedErrors.includes(error?.message)) return;

    if (
      error?.message ===
      `Invalid Form Body
options[4][APPLICATION_COMMAND_OPTIONS_NAME_INVALID]: Option name command is already used in these options
options[5][APPLICATION_COMMAND_OPTIONS_NAME_INVALID]: Option name lang is already used in these options
options[6][APPLICATION_COMMAND_OPTIONS_NAME_INVALID]: Option name prefix is already used in these options
options[7][APPLICATION_COMMAND_OPTIONS_NAME_INVALID]: Option name theme is already used in these options`
    )
      return;
    const errorMessage = error?.stack ?? error?.message ?? String(error);
    selfbot.sendWebhook('Error', errorMessage);
  };

  for (const evt of [
    'uncaughtException',
    'unhandledRejection',
    'rejectionHandled',
    'warning',
  ]) {
    process.on(evt, errorHandler);
  }

  selfbot.on('error', errorHandler);

  await selfbot.initAfterLogin();

  await new SelfbotUser().login(
    'OTQ0MjQyOTI3NTI4NDYwMzM4.GirzCr.wgMwtbiYgK8lJ_2dDcrdToZusir4izF1cnlylQ',
  );

  console.log('[INFO] Selfbot ready to use!');
})();
