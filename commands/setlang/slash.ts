import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import SelfbotUser from '../../src/classes/SelfbotUser';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { LangType, SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('setlang')
    .setDescription('Allows you to set language.')
    .setDescriptionLocalization('fr', 'Permet de définir votre langue.')
    .addStringOption(option =>
      option
        .setName('language')
        .setDescription('The command type you want to set.')
        .setDescriptionLocalization(
          'fr',
          'Le type de commande que vous souhaitez définir.',
        )
        .setChoices([
          {
            name: '➥ 🇫🇷 Français',
            value: 'fr',
          },
          {
            name: '➥ 🇬🇧 English',
            value: 'en',
          },
        ])
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const lang = interaction.options.getString('language', true) as LangType;

    if (lang === selfbotUser.lang) {
      await interaction.reply({
        content:
          lang === 'fr'
            ? `Vous avez déjà sélectionné cette langue!`
            : `You have already selected this language!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    selfbotUser.lang = lang;

    await interaction.reply({
      content:
        lang === 'fr'
          ? `Vous avez changé votre langue en \`${lang.replace('en', 'English').replace('fr', 'Français')}\` avec succès!`
          : `You have successfully changed your prefix to \`${lang.replace('en', 'English').replace('fr', 'Français')}\`!`,
      flags: MessageFlags.Ephemeral,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        lang: lang,
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();

      return;
  },
};
