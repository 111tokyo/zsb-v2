import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('rpc')
    .setDescription('Allows you to manage your RPC status options.')
    .setDescriptionLocalization(
      'fr',
      'Permet de gérer vos options de status RPC.',
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const { choice, richPresences } = selfbotUser.statusOptions;
    const options = richPresences.map(rpc => ({
      label: rpc.id,
      value: rpc.id,
      description:
        selfbotUser.lang === 'fr'
          ? "Permet d'apparaître avec le RPC " + rpc.id
          : 'Allows you to appear with the RPC ' + rpc.id,
      emoji: {
        id: '1365695166668603433',
      },
      default: rpc.id === choice,
    }));

    await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: 'rpcchoice',
                  options: options,
                  placeholder:
                    selfbotUser.lang === 'fr'
                      ? 'Choisis ton status RPC'
                      : 'Select your RPC status',
                  min_values: 1,
                  max_values:
                    richPresences.length > 3 ? 3 : richPresences.length,
                  disabled: false,
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
                  style: 3,
                  label: selfbotUser.lang === 'fr' ? 'Appliquer' : 'Apply',
                  emoji: {
                    id: '1364590640557457408',
                  },
                  disabled: false,
                  custom_id: 'apply_rpc',
                },
                {
                  type: 2,
                  style: 1,
                  label:
                    selfbotUser.lang == 'fr'
                      ? 'Creer un nouveau RPC'
                      : 'Create new RPC',
                  emoji: {
                    id: '1356990747244499188',
                  },
                  disabled: false,
                  custom_id: 'create_rpc',
                },
                {
                  type: 2,
                  style: 4,
                  label:
                    selfbotUser.lang == 'fr'
                      ? 'Supprimer un RPC'
                      : 'Delete a RPC',
                  emoji: {
                    id: '1365699526467260537',
                  },
                  disabled: false,
                  custom_id: 'delete_rpc',
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
