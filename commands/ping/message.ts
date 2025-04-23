import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Pong! \`${selfbotUser.ws.ping}\`ms**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**Pong! \`${selfbotUser.ws.ping}\`ms**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });
    return;
  },
};
