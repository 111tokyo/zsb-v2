import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import config from '../../src/config';
import { SlashCommand } from '../../src/types/interactions';
export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Allows you to have the User.exe support server.')
    .setDescriptionLocalization('fr', 'Permet de voir le serveur support User.exe.'),

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
        .setEmoji('1366058652192215134')
        .setURL(config.supportServerInvite),
    );

    await interaction.reply({
      components: [support],
      flags: MessageFlags.Ephemeral,
    });
  },
};
