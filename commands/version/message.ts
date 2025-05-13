import { time } from 'discord.js';
import config from '../../src/config';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**La version du selfbot est: \`${config.version}\`**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**The selfbot version is: \`${config.version}\`**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
    return;
  },
};
