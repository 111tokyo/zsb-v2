import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('dmallbot')
    .setDescription('Allows you to send a message to all user\'s of a bot.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'envoyé un message à tous les utilisateurs d'un bot.",
    )
    .addUserOption(option =>
      option
        .setName('token')
        .setDescription('The token of the bot you want to dmall')
        .setDescriptionLocalization(
          'fr',
          "Le token du bot à qui vous souhaitez envoyé un message à tous les utilisateurs.",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Cette commande est réservé aux utilisateurs premium!`
            : `This command is reserved for premium users!`,
            flags: MessageFlags.Ephemeral
      }); 
  }
};
