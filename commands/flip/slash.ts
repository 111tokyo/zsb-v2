import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Allows you to flip a coin to get heads or tails.')
    .setDescriptionLocalization(
      'fr',
      'Permet de lancer une pièce pour obtenir pile ou face.',
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const result = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `### ${result === 1 ? 'Pile!' : 'Face!'}`
          : `### ${result === 1 ? 'Heads!' : 'Tails!'}`,
      flags: MessageFlags.Ephemeral,
    });

    return;
  },
};
