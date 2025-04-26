import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageFlags,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { ContextCommand } from '../../src/types/interactions';

export const contextCommand: ContextCommand<UserContextMenuCommandInteraction> =
  {
    data: new ContextMenuCommandBuilder()
      .setName('Profile Banner')
      .setType(ApplicationCommandType.User),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: UserContextMenuCommandInteraction,
    ) => {
      const user = interaction.targetUser;
      const banner = (await user.fetch()).bannerURL({
        extension: 'png',
        size: 2048,
      });

      if (!banner) {
        if (user.id === selfbotUser.user!.id) {
          interaction.reply({
            content:
              selfbotUser.lang === 'fr'
                ? "Vous n'avez pas de bannière."
                : 'You do not have a banner.',
            flags: MessageFlags.Ephemeral,
          });
          return;
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
