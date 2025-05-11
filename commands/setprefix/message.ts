import { time } from 'discord.js';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un nouveau préfixe! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a new prefix! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (args[0].length > 10) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le nouveau préfixe doit être inférieur à 10 caractères! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The new prefix must be less than 10 characters! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (args[0] === selfbotUser.prefix) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Votre nouveau préfixe doit être différent de l'actuel! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**Your new prefix must be different from the current one! (*Exemple*: \`${selfbotUser.prefix}set-prefix !\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.prefix = args[0];

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez changé votre préfixe en \`${args[0]}\` avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You have successfully changed your prefix to \`${args[0]}\`!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        prefix: args[0],
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
  },
};
