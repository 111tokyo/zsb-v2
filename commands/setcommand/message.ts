import { time } from 'discord.js';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { MessageCommand } from '../../src/types/interactions';
import { CommandType } from '../../src/types/selfbot';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un type de commande! (*Exemple*: \`${selfbotUser.prefix}set-command slash\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a command type! (*Exemple*: \`${selfbotUser.prefix}set-command slash\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (
      args[0].toLowerCase() !== 'prefix' &&
      args[0].toLowerCase() !== 'both' &&
      args[0].toLowerCase() !== 'slash'
    ) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le type de commande doit être "__both__", "__slash__" ou "__prefix__"!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The command type must be "__both__", "__slash__" or "__prefix__"!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (
      args[0][0].toUpperCase() + args[0].slice(1).toLowerCase() ===
      selfbotUser.commandType
    ) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous avez déjà sélectionné ce type de commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You have already selected this command type!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.commandType = (args[0][0].toUpperCase() +
      args[0].slice(1).toLowerCase()) as CommandType;

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez changé votre type de commande en \`${args[0][0].toUpperCase() + args[0].slice(1).toLowerCase()}\` avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You have successfully changed your command type to \`${args[0][0].toUpperCase() + args[0].slice(1).toLowerCase()}\`!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });

    if (
      args[0][0].toUpperCase() + args[0].slice(1).toLowerCase() ===
      'Prefix'
    ) {
      await selfbotUser.deauthorize(selfbot.user!.id);
    } else {
      await selfbotUser.installUserApps(selfbot.user!.id);
    }

    await db
      .update(selfbotUsersTable)
      .set({
        commandType: args[0][0].toUpperCase() + args[0].slice(1).toLowerCase(),
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
  },
};
