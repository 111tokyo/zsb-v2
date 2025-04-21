import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Allows you to go AFK.')
    .setDescriptionLocalization('fr', 'Permet de devenir AFK.')
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason why you are AFK.')
        .setDescriptionLocalization(
          'fr',
          'La raison pour laquelle vous êtes AFK.',
        )
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const reason = interaction.options.getString('reason', true);

    selfbotUser.afk = reason;

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous êtes maintenant AFK`
          : `You're now AFK`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
