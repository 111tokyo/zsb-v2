import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('fakeip')
    .setDescription('Allows you to generates a fake IP address.')
    .setDescriptionLocalization(
      'fr',
      'Permet de génèrer une fausse adresse IP.',
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const fakeIP = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256),
    ).join('.');

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Adresse IP générée: \`${fakeIP}\``
          : `Generated IP address: \`${fakeIP}\``,
      flags: MessageFlags.Ephemeral,
    });

    return;
  },
};
