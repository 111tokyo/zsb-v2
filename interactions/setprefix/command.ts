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
    .setName('setprefix')
    .setDescription('Allows you to set a new prefix.')
    .setDescriptionLocalization('fr', 'Permet de définir un nouveau préfixe.')
    .addStringOption(option =>
      option
        .setName('prefix')
        .setDescription('The new prefix you want to set.')
        .setDescriptionLocalization(
          'fr',
          'Le nouveau préfixe que vous souhaitez définir.',
        )
        .setMaxLength(10)
        .setMinLength(1)
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const prefix = interaction.options.getString('prefix', true);

    if (prefix === selfbotUser.prefix) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Votre nouveau préfixe doit être différent de l'actuel!`
            : `Your new prefix must be different from the current one!`,
      });
      return;
    }

    selfbotUser.prefix = prefix;

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez changé votre préfixe en \`${prefix}\` avec succès!`
          : `You have successfully changed your prefix to \`${prefix}\`!`,
      flags: MessageFlags.Ephemeral,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        prefix: prefix,
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();

      return;
  },
};
