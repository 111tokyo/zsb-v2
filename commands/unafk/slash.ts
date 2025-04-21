import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('unafk')
    .setDescription('Allows you to no longer be AFK.')
    .setDescriptionLocalization('fr', 'Permet de ne plus être AFK.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (selfbotUser.afk) {
      selfbotUser.afk = null;
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'êtes maintenant plus AFK`
            : `You're now no longer AFK`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'êtes déjà pas AFK!`
            : `You're already not AFK!`,
        flags: MessageFlags.Ephemeral,
      });
    }
    return;
  },
};
