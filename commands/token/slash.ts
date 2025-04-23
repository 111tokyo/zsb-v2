import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
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
            ],
          },
        ],
      },
    ]);
  },
};
