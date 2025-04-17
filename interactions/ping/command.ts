import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Allows you to see the latency of the selfbot.')
    .setDescriptionLocalization('fr', 'Permet de voir la latence du selfbot.'),

  execute: async (
    _selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      content: `Pong! **\`${interaction.client.ws.ping}\`ms**`,
      flags: MessageFlags.Ephemeral,
    });

    return;
  },
};
