import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0] || !args[1]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un minimum et un maximum! (*Exemple*: \`${selfbotUser.prefix}roll 1 100\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a minimum and maximum! (*Example*: \`${selfbotUser.prefix}roll 1 100\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const min = parseInt(args[0]);
    const max = parseInt(args[1]);

    if (isNaN(min) || isNaN(max)) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Les arguments doivent être des nombres!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**Arguments must be numbers!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (min >= max) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le minimum doit être inférieur au maximum!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The minimum must be less than the maximum!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `### ${result}\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `### ${result}\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
  },
};
