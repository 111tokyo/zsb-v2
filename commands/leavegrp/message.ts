import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (message.channel.type !== 'GROUP_DM') {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être dans un groupe pour utiliser cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a group to use this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    await message.delete();
    await fetch(
      `https://discord.com/api/v9/channels/${message.channel.id}?silent=true`,
      {
        headers: {
          authorization: selfbotUser.token!,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      },
    );
    return;
  },
};
