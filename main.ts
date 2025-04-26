import Selfbot from './src/classes/Selfbot';
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

  /* // Example of fetching and deleting a command

  const commands = await selfbot.application!.commands.fetch();

  commands.forEach(cmd => {
    console.log(`${cmd.name} => ${cmd.id}`);
  });

  await (await selfbot.application?.commands.fetch('1365691023619002430'))
    ?.delete()
    .catch(e => console.error(e));

  */

  console.log('[INFO] Selfbot ready to use!');
})();
