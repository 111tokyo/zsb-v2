import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('pic')
    .setDescription('Allows you to get the profile picture about a user.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'obtenir la photo de profil d'un utilisateur.",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to get the profile picture about')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous souhaitez avoir la photo de profil",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const avatar = targetUser.displayAvatarURL({
      extension: 'png',
      size: 2048,
    });

    interaction.reply({
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 12,
              items: [
                {
                  media: {
                    url: avatar,
                  },
                  description: null,
                  spoiler: false,
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label:
                    selfbotUser.lang === 'fr'
                      ? "URL de l'avatar"
                      : 'Avatar URL',
                  emoji: {
                    id: '1365681835807608832',
                  },
                  disabled: false,
                  url: avatar,
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
          ],
        },
      ] as any,
    });
  },
};
