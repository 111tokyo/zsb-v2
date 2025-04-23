import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('logout')
    .setDescription('Allows you to logout from ZSB.')
    .setDescriptionLocalization('fr', 'Permet de vous déconnecter de ZSB.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez été déconnecté de ZSB avec succès!`
          : `You've been succesfully logout from ZSB!`,
      flags: MessageFlags.Ephemeral,
    });

    await selfbotUser.logout();
    return;
  },
};
