import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import config from '../../src/config';
export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Allows you to have the ZSB support server')
    .setDescriptionLocalization('fr', 'Permet de voir le serveur support ZSB'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const support = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(
          selfbotUser.lang === 'fr' ? 'Serveur support' : 'Support server',
        )
        .setURL(config.supportServerInvite),
    );

    await interaction.reply({
      components: [support],
      flags: MessageFlags.Ephemeral,
    });
  },
};
