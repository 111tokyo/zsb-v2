import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  userMention,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('tokengrab')
    .setDescription('Allow you to get the beginning of the token of a user.')
    .setDescriptionLocalization(
      'fr',
      "Permet de récupérer le début du token d'un utilisateur.",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to get the token from.')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous voulez récupérer le token.",
        )
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const user = interaction.options.getUser('user', true);
    const decoded = Buffer.from(user.id).toString('base64').replace('==', '');

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Le token de ${userMention(user.id)} commence par: \`${decoded}***********************************\``
          : `The token of ${userMention(user.id)} starts with: \`${decoded}***********************************\``,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
