import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Allows you to leave a voice channel.')
    .setDescriptionLocalization('fr', 'Permet de quitter un salon vocal.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (!selfbotUser.voice.connection) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'êtes pas dans un aucun salon vocal!`
            : `You're not in a voice channel!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    selfbotUser.voiceOptions.voiceChannelId = null;
    selfbotUser.voice.connection.disconnect();

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez quitter ${selfbotUser.voice.connection.channel} avec succès!`
          : `You've succesfully left ${selfbotUser.voice.connection}!`,
      flags: MessageFlags.Ephemeral,
    });

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
