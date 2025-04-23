import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Allows you to see your ZSB settings.')
    .setDescriptionLocalization('fr', 'Permet de voir vos paramètres ZSB.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `## › Vos paramètres:\n> **Préfixe:** \`${selfbotUser.prefix}\`\n> **Type de commande:** \`${selfbotUser.commandType}\`\n> **Langue:** \`${selfbotUser.lang}\`\n> **Type de compte:** \`Standard\``
          : `## › Your settings:\n> **Prefix:** \`${selfbotUser.prefix}\`\n> **Command type:** \`${selfbotUser.commandType}\`\n> **Language:** \`${selfbotUser.lang}\`\n> **Account type:** \`Standard\``, 
      flags: MessageFlags.Ephemeral,
    });
    return;
  },
};
