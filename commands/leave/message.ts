import { time } from 'discord.js';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!selfbotUser.voice.connection) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'êtes pas dans un aucun salon vocal!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You're not in a voice channel!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.voiceOptions.voiceChannelId = null;
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez quitter ${selfbotUser.voice.connection.channel} avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You've succesfully left ${selfbotUser.voice.connection}!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });

    selfbotUser.voice.connection.disconnect();

    await db
      .update(selfbotUsersTable)
      .set({
        voiceOptions: JSON.stringify(selfbotUser.voiceOptions),
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
    return;
  },
};
