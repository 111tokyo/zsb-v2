import { time } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
    const now = Math.floor(Date.now() / 1000);
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

    options.push({
      label: 'No status',
      value: 'no_status',
      description:
        selfbotUser.lang === 'fr'
          ? "Permet d'apparaître sans RPC"
          : 'Allows you to appear without a RPC',
      emoji: {
        id: '1371498972069367939',
      },
      default: choice === null,
    });

    const int = await interaction.update({
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
                  disabled: true,
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
                  disabled: true,
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
                    id: '1371783183149830234',
                  },
                  disabled: true,
                  custom_id: 'delete_rpc',
                },
              ],
            },
            {
              type: 14,
              divider: false,
              spacing: 1,
            },
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `-# > Options appliquées avec succès! Vous pourrez réappliquer vos options de status RPC ${time(now + 21, 'R')}`
                  : `-# > Options succesfully applied! You will be able to reaply your RPC status options ${time(now + 21, 'R')}`,
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

    await selfbotUser.applyRichPresence();
    await selfbotUser.setDBData();

    setTimeout(async () => {
      await int.edit({
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
                    disabled: true,
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
                      id: '1371783183149830234',
                    },
                    disabled: true,
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
        ],
      });
    }, 1000 * 20);
  },
};
