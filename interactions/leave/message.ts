import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    if (!selfbotUser.voice.connection) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'êtes pas dans un aucun salon vocal!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You're not in a voice channel!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.voiceStateOptions.voiceChannelId = null;
    selfbotUser.voice.connection.disconnect();

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez quitter ${selfbotUser.voice.connection.channel} avec succès!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You've succesfully left ${selfbotUser.voice.connection}!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        voiceStateOptions: JSON.stringify(selfbotUser.voiceStateOptions),
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
    return;
  },
};
