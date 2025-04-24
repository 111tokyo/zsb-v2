import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const timestamp = Date.now().toString();
    const part1 = Buffer.from(timestamp).toString('base64').replace(/=/g, '');
    const part2 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array.from({ length: 27 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    const fakeToken = `${part1}${part2}${part3}`;

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `### Token généré : \`${fakeToken}\`\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `### Generated token: \`${fakeToken}\`\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
    );
  },
};
