import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    if (selfbotUser.afk) {
      selfbotUser.afk = null;
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'êtes maintenant plus AFK**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You're now no longer AFK**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
    } else {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'êtes déjà pas AFK!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You're already not AFK!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
    }
    return;
  },
};
