import { REST, Routes } from 'discord.js';
import config from '../config';

const rest = new REST({ version: '10' }).setToken(config.clientToken);

export const sendNewComponents = async (
  channelId: string,
  components: Object,
  fallbackUserId?: string,
  timeout?: number,
) => {
  const sendMessage = async (targetChannelId: string) => {
    const message: any = await rest.post(
      Routes.channelMessages(targetChannelId),
      {
        body: {
          components: components,
          flags: 1 << 15,
        },
      },
    );

    if (timeout && timeout > 0) {
      setTimeout(async () => {
        try {
          await rest.delete(Routes.channelMessage(targetChannelId, message.id));
        } catch {}
      }, timeout);
    }
  };

  try {
    return await sendMessage(channelId);
  } catch {
    if (fallbackUserId) {
      try {
        const dmChannel: any = await rest.post(Routes.userChannels(), {
          body: {
            recipient_id: fallbackUserId,
          },
        });
        return await sendMessage(dmChannel.id);
      } catch {}
    }
  }
};
