import { REST, Routes } from 'discord.js';
import config from '../config';

const rest = new REST({ version: '10' }).setToken(config.clientToken);

export const replyNewComponents = async (
  interactionId: string,
  interactionToken: string,
  components: any,
) => {
  const responsePayload = {
    type: 4,
    data: {
      components: components,
      flags: (1 << 6) | (1 << 15),
    },
  };

  try {
    await rest.post(
      Routes.interactionCallback(interactionId, interactionToken),
      { body: responsePayload },
    );
  } catch (error: any) {
    if (error.code === 40060) {
      try {
        await rest.patch(
          Routes.webhookMessage(config.clientId, interactionToken),
          {
            body: {
              components: components,
              flags: (1 << 6) | (1 << 15),
            },
          },
        );
      } catch {
      }
    } else {
    }
  }
};
