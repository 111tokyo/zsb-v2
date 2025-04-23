import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('settheme')
    .setDescription('Allows you to set .')
    .setDescriptionLocalization('fr', 'Permet de définir votre thème.')
    .addStringOption(option =>
      option
        .setName('accent')
        .setDescription('The theme accent you want to set.')
        .setDescriptionLocalization(
          'fr',
          'La teinte de thème que vous souhaitez définir.',
        )
        .setChoices([
          {
            name: '➥ ⚫ Dark',
            value: 'dark',
          },
          {
            name: '➥ ⚪ Light',
            value: 'light',
          },
        ])
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const theme = interaction.options.getString('accent', true) as
      | 'dark'
      | 'light';

    if (theme === selfbotUser.settings.theme) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous avez déjà sélectionné ce thème!`
            : `You have already selected this theme!`,
      });
      return;
    }

    await selfbotUser.settings.setTheme(theme);

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez changé votre thème en \`${theme[0].toUpperCase() + theme.slice(1)}\` avec succès!`
          : `You have successfully changed your theme to \`${theme[0].toUpperCase() + theme.slice(1)}\`!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
