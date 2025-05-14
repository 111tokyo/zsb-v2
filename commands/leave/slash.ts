import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import SelfbotUser from '../../src/classes/SelfbotUser';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { SlashCommand } from '../../src/types/interactions';

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
    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez quitter ${selfbotUser.voice.connection.channel} avec succès!`
          : `You've succesfully left ${selfbotUser.voice.connection.channel}!`,
      flags: MessageFlags.Ephemeral,
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
