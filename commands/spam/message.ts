import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un nombre de messages à spammer! (*Exemple*: \`${selfbotUser.prefix}spam 10 teste\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a number of messages to spam! (*Exemple*: \`${selfbotUser.prefix}spam 10 test\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (isNaN(parseInt(args[0]))) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le nombre de messages à spammer doit être un chiffre! (*Exemple*: \`${selfbotUser.prefix}spam 10 teste\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**The number of messages to spam must be a digit! (*Exemple*: \`${selfbotUser.prefix}spam 10 test\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (parseInt(args[0]) > 50) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous ne pouvez pas spammer plus de 50 messages à la fois!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You cannot spam more than 50 messages at once!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (!args[1]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un messages à spammer! (*Exemple*: \`${selfbotUser.prefix}spam 10 teste\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a messages to spam! (*Exemple*: \`${selfbotUser.prefix}spam 10 test\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    await message.delete();

    const count = parseInt(args[0]);
    const spamContent = args.slice(1).join(' ');

    await Promise.all(
      Array.from({ length: count }).map(() =>
        message.channel.send(spamContent),
      ),
    );
  },
};
