import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const snipedMessage = selfbotUser.snipe.get(message.channelId);
    if (!snipedMessage) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Aucun message n'a été supprimé dans ce salon.**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**No messages have been deleted in this channel.**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
    } else {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**__Envoyé par: ${snipedMessage.author}__**\n\`\`\`${snipedMessage.content.replace("`", "")}\`\`\`\n<t:${Math.floor(
                snipedMessage.createdTimestamp / 1000,
              )}:R>\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**__Sent by: ${snipedMessage.author}__**\n\`\`\`${snipedMessage.content.replace("`", "")}\`\`\`<t:${Math.floor(
                snipedMessage.createdTimestamp / 1000,
              )}:R>\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
    }
    return;
  },
};
