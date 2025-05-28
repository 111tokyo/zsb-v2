import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un nombre de messages à supprimer! (*Exemple*: \`${selfbotUser.prefix}clear 10\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a number of messages to delete! (*Exemple*: \`${selfbotUser.prefix}clear 10\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (isNaN(parseInt(args[0]))) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le nombre de messages à supprimer doit être un chiffre! (*Exemple*: \`${selfbotUser.prefix}clear 10\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The number of messages to delete must be a digit! (*Exemple*: \`${selfbotUser.prefix}clear 10\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (parseInt(args[0]) > 99) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous ne pouvez pas supprimer plus de 99 messages à la fois!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You cannot delete more than 99 messages at once!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    await message.delete();

    const msg = await message.channel.send({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous êtes entrain de supprimer\`${parseInt(args[0])}\` messages...**`
          : `**You are deleting \`${parseInt(args[0])}\` messages...**`,
    });

    const messages = await message.channel.messages
      .fetch({
        limit: parseInt(args[0]) + 1,
      })
      .then(messages => messages.filter(message => message.id !== msg.id));

    while (messages.size < parseInt(args[0])) {
      const fetchedMessages = await message.channel.messages.fetch({
        limit: parseInt(args[0]) - messages.size,
      });
      messages.concat(fetchedMessages.filter(message => message.id !== msg.id));
    }

    let count = 0;

    const deletePromises = Array.from(messages.values()).map(async message => {
      count++;
      await message.delete().catch(() => {
        count--;
      });
    });

    await Promise.all(deletePromises);

    if (count === 0) {
      await msg.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Il n'y avait aucun message à supprimer.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**There were no messages to delete.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      setTimeout(async () => {
        await msg.delete().catch(() => null);
      }, 15000);
    } else {
      await msg.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous avez supprimé \`${count}\` messages avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You have successfully deleted \`${count}\` messages!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      setTimeout(async () => {
        await msg.delete().catch(() => null);
      }, 15000);
    }
  },
};
