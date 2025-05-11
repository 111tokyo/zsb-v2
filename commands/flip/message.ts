import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    const result = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `### ${result === 1 ? 'Pile!' : 'Face!'}\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `### ${result === 1 ? 'Heads!' : 'Tails!'}\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
  },
};
