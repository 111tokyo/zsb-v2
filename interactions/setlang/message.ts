import { time } from 'discord.js';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { CommandType, MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (!args[0]) {
      await message.edit({
        content:
          args[0].toLowerCase() === 'fr'
            ? `**Vous devez spécifier une langue! (*Exemple*: \`${selfbotUser.prefix}set-lang en\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a language! (*Exemple*: \`${selfbotUser.prefix}set-command fr\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (args[0].toLowerCase() !== 'fr' && args[0].toLowerCase() !== 'en') {
      await message.edit({
        content:
          args[0].toLowerCase() === 'fr'
            ? `**La langue doit être "__Fr__" ou "__En__"!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**The language must be "__Fr__" or "__En__"!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (args[0].toLowerCase() === selfbotUser.lang) {
      await message.edit({
        content:
          args[0].toLowerCase() === 'fr'
            ? `**Vous avez déjà sélectionné cette langue!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You have already selected this language!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.commandType = args[0].toLowerCase() as CommandType;

    await message.edit({
      content:
        args[0].toLowerCase() === 'fr'
          ? `**Vous avez changé votre langue en \`${args[0].toLowerCase().replace('en', 'English').replace('fr', 'Français')}\` avec succès!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You have successfully changed your language to \`${args[0].toLowerCase().replace('en', 'English').replace('fr', 'Français')}\`!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        lang: args[0].toLowerCase(),
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
  },
};
