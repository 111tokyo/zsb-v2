import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Allows you to get the profile banner about a user.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'obtenir la bannière de profil d'un utilisateur.",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to get the profile banner about')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous souhaitez avoir la bannière de profil",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const banner = (await targetUser.fetch()).bannerURL({
      extension: 'png',
      size: 2048,
    });

    if (!banner) {
      if(targetUser.id === selfbotUser.user!.id) {
        interaction.reply({
          content:
            selfbotUser.lang === 'fr'
              ? "Vous n'avez pas de bannière."
              : 'You do not have a banner.',
          flags: MessageFlags.Ephemeral,
        });
        return
      }
      interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? "Cet utilisateur n'a pas de bannière."
            : 'This user does not have a banner.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

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
                    url: banner,
                  },
                  description: null,
                  spoiler: false,
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label:
                    selfbotUser.lang === 'fr'
                      ? 'URL de la bannière'
                      : 'Banner URL',
                  emoji: {
                    id: '1365681835807608832',
                  },
                  disabled: false,
                  url: banner,
                },
              ],
            },
          ],
        },
      ] as any,
    });
  },
};
