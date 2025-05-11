import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import selfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('prevnames')
    .setDescription('Allows you to retrieve the previous names of a user.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'obtenir les anciens noms d'un utilisateur.",
    )
    .addUserOption(option =>
      option
        .setDescription(
          'The user that you want to retrieve the previous names.',
        )
        .setName('user')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous souhaitez obtenir les anciens noms.",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: selfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? "Cette commande n'est pas encore disponible."
          : 'This command is not available yet.',
      flags: MessageFlags.Ephemeral,
    });
  },
};
