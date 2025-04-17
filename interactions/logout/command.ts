import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { deleteUserByToken } from '../../src/db/actions';
import { selfbot } from '../../main';

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

    await deleteUserByToken(selfbotUser.token!);
    selfbotUser.removeAllListeners().destroy();
    selfbot.selfbotUsers.delete(selfbotUser.user!.id);
    return;
  },
};
