import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('dmfriends')
    .setDescription('Allows you to send a message to all your friends.')
    .setDescriptionLocalization(
      'fr',
      'Permet d\'envoyer un message à tous vos amis.',
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const friends = selfbotUser.relationships.friendCache.size;

    if (friends === 0) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? 'Vous n\'avez pas d\'amis.'
            : 'You have no friends.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `> Voulez-vous vraiment envoyer un message à vos **\`${friends}\`** amis ?`
                  : `> Do you really want to send a message to your **\`${friends}\`** friends?`,
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
                      ? 'Envoyer le message'
                      : 'Send the message',
                  emoji: null,
                  disabled: false,
                  custom_id: 'dmfriends',
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

    return;
  },
};
