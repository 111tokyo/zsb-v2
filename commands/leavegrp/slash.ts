import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('leavegrp')
    .setDescription('Allows you to leave a group.')
    .setDescriptionLocalization('fr', 'Permet de quitter un groupe.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (interaction.channel?.type !== ChannelType.GroupDM) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être dans un groupe pour utiliser cette commande!`
            : `You must be in a group to use this command!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await fetch(
      `https://discord.com/api/v9/channels/${interaction.channelId}?silent=true`,
      {
        headers: {
          authorization: selfbotUser.token!,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      },
    );
    return;
  },
};
