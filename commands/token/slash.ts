import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  time,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { replyNewComponents } from '../../src/util/replyNewComponents';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('token')
    .setDescription('Allows you to see your discord token')
    .setDescriptionLocalization('fr', 'Permet de voir votre token discord'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    await replyNewComponents(interaction.id, interaction.token, [
      {
        type: 17,
        accent_color: null,
        spoiler: true,
        components: [
          {
            type: 10,
            content:
              selfbotUser.lang === 'fr'
                ? `Votre token discord:\`\`\`${selfbotUser.token}\`\`\``
                : `Your discord token:\`\`\`${selfbotUser.token}\`\`\``,
          },
          {
            type: 14,
            divider: true,
            spacing: 1,
          },
          {
            type: 9,
            accessory: {
              type: 2,
              style: 2,
              label:
                selfbotUser.lang === 'fr'
                  ? 'Réinitialiser le token'
                  : 'Reset token',
              emoji: null,
              disabled: false,
              custom_id: 'reset_token',
            },
            components: [
              {
                type: 10,
                content:
                  selfbotUser.lang === 'fr'
                    ? "-# > Nous vous déconseillons fortement de partager votre token Discord avec d'autres utilisateurs. Des assaillants pourraient s'en servir pour pirater votre compte."
                    : '-# > We strongly advise you not to share your Discord token with other users. Attackers could use it to hack your Discord account.',
              },
            ],
          },
          {
            type: 14,
            divider: true,
            spacing: 1,
          },
          {
            type: 10,
            content:
              selfbotUser.lang === 'fr'
                ? `-# ➜ *Suppression du message ${time(
                    Math.floor(Date.now() / 1000) + 31,
                    'R',
                  )}*`
                : `-# ➜ *Deleting message ${time(
                    Math.floor(Date.now() / 1000) + 31,
                    'R',
                  )}*`,
          },
        ],
      },
    ]);
  },
};
