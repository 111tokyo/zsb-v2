import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Allows you to get a random number.')
    .setDescriptionLocalization(
      'fr',
      "Permet de lancer d'obtenir un nombre aléatoire.",
    )
    .addNumberOption(option =>
      option
        .setName('min')
        .setDescription('The maximum number that you can get.')
        .setDescriptionLocalization(
          'fr',
          'Le nombre minimum que vous pouvez obtenir.',
        )
        .setRequired(true),
    )
    .addNumberOption(option =>
      option
        .setName('max')
        .setDescription('The maximum number that you can get.')
        .setDescriptionLocalization(
          'fr',
          'Le nombre maximum que vous pouvez obtenir.',
        )
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const min = interaction.options.getNumber('min', true);
    const max = interaction.options.getNumber('max', true);

    if (min >= max) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Le minimum doit être inférieur au maximum.`
            : `The minimum must be less than the maximum.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;

    await interaction.reply({
      content: selfbotUser.lang === 'fr' ? `### ${result}` : `### ${result}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
