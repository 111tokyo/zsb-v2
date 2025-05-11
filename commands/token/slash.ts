import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('token')
    .setDescription('Allows you to see your Discord token.')
    .setDescriptionLocalization('fr', 'Permet de voir votre token Discord.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: true,
          components: [
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `Votre token Discord:\`\`\`${selfbotUser.token}\`\`\``
                  : `Your Discord token:\`\`\`${selfbotUser.token}\`\`\``,
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
                  style: 2,
                  label:
                    selfbotUser.lang === 'fr'
                      ? 'Comment réinitialiser son token?'
                      : 'How do I reset my token?',
                  emoji: {
                    id: '1364588505321181275',
                  },
                  disabled: false,
                  custom_id: 'reset_token',
                },
                {
                  type: 2,
                  style: 2,
                  label:
                    selfbotUser.lang === 'fr'
                      ? "Qu'est-ce qu'un token?"
                      : 'What is a token?',
                  emoji: {
                    id: '1364588505321181275',
                  },
                  disabled: false,
                  custom_id: 'whats_token',
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
      ],
    });
  },
};
