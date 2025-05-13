import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import config from '../../src/config';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Allows you to see the version of the selfbot.')
    .setDescriptionLocalization('fr', 'Permet de voir la version du selfbot.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `La version du selfbot est: \`${config.version}\``
          : `The selfbot version is: \`${config.version}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
};
