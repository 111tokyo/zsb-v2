import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    const fakeIP = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256),
    ).join('.');

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Adresse IP générée: \`${fakeIP}\`**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
        : `**Generated IP address: \`${fakeIP}\`**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    );
  },
};
