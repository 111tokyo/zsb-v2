import { time } from 'discord.js';
import { TextChannel } from 'discord.js-selfbot-v13';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour executer cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const newChannel = await (message.channel as TextChannel)
      .clone()
      .catch(() => null);

    if (!newChannel) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'avez pas les permissions nécéssaires pour recréé ${message.channel}!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You don't have the necessary permissions to renew ${message.channel}!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    await message.channel.delete().catch(() => null);

    const newMessage = await newChannel.send('.');

    setTimeout(async () => {
      await newMessage.delete();
    }, 2 * 1000);
  },
};
