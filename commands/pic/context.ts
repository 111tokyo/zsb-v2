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
      .setName('Profile Picture')
      .setType(ApplicationCommandType.User),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: UserContextMenuCommandInteraction,
    ) => {
      const user = interaction.targetUser;
      const avatar = user.displayAvatarURL({ extension: 'png', size: 2048 });

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
            ],
          },
        ] as any,
      });
    },
  };
