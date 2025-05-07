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
    .setDescription('Allows you to logout from User.exe.')
    .setDescriptionLocalization('fr', 'Permet de vous déconnecter de User.exe.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez été déconnecté de User.exe avec succès!`
          : `You've been succesfully logout from User.exe!`,
      flags: MessageFlags.Ephemeral,
    });

    await selfbotUser.logout();
    return;
  },
};
