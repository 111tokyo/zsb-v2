import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ddos')
    .setDescription('Allows you to DDOS an IP address.')
    .setDescriptionLocalization('fr', 'Permet de DDOS une address IP.')
    .addStringOption(option =>
      option
        .setName('ip-address')
        .setDescription('The IP address that you want to DDOS')
        .setDescriptionLocalization(
          'fr',
          "L'adresse IP que vous souhaitez DDOS.",
        )
        .setRequired(true),
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
      flags: MessageFlags.Ephemeral,
    });
  },
};
