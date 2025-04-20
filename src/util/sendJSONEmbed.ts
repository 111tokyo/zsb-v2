import config from '../config';

import { REST, Routes } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(config.clientToken);

export const sendJSONEmbed = async (
  channelId: string,
  JSON: Object,
  content?: string,
) => {
  try {
    const dmChannel = (await rest.post(Routes.userChannels(), {
      body: { recipient_id: channelId },
    })) as { id: string };

    await rest.post(Routes.channelMessages(dmChannel.id), {
      body: {
        content: content ?? '',
        components: JSON,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
