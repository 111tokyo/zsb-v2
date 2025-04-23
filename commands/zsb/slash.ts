import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { selfbot } from '../../main';
import SelfbotUser from '../../src/classes/SelfbotUser';
import config from '../../src/config';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('zsb')
    .setDescription('Allows you to see some information about ZSB.')
    .setDescriptionLocalization(
      'fr',
      'Permet de voir des informations sur ZSB.',
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `### › ZSB Selfbot\n\n> Commands: \`${selfbot.messageCommandInteraction.size}\`\n> Users: \`${selfbot.userNb}\`\n\nSupport: ${config.supportServerInvite}\nCommande d'aide: \`${selfbotUser.prefix}help\``
          : `### › ZSB Selfbot\n\n> Commands: \`${selfbot.messageCommandInteraction.size}\`\n> Users: \`${selfbot.userNb}\`\n\nSupport: ${config.supportServerInvite}\nHelp command: \`${selfbotUser.prefix}help\``,
      flags: [MessageFlags.SuppressEmbeds, MessageFlags.Ephemeral],
    });
  },
};
