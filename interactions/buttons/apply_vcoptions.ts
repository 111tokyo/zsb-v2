import { time } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
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
                  custom_id: 'vcoptions',
                  options: [
                    {
                      label:
                        selfbotUser.lang === 'fr'
                          ? 'Couper le microphone'
                          : 'Cut the microphone',
                      value: 'mute',
                      description:
                        selfbotUser.lang === 'fr'
                          ? "Permet d'apparaitre avec le microphone coupé"
                          : 'Allows you to appear with the microphone cut',
                      emoji: {
                        id: '1364582553389891684',
                      },
                      default: selfbotUser.voiceOptions.selfMute,
                    },
                    {
                      label: selfbotUser.lang ? 'Être en sourdine' : 'Be deaf',
                      value: 'deaf',
                      description:
                        selfbotUser.lang === 'fr'
                          ? "Permet d'apparaitre en sourdine"
                          : 'Allows you to appear deaf',
                      emoji: {
                        id: '1364582551661838426',
                      },
                      default: selfbotUser.voiceOptions.selfDeaf,
                    },
                    {
                      label: selfbotUser.lang
                        ? 'Activer la caméra'
                        : 'Enable camera',
                      value: 'camera',
                      description:
                        selfbotUser.lang === 'fr'
                          ? "Permet d'apparaitre avec la caméra activée"
                          : 'Allows you to appear with the camera on',
                      emoji: {
                        id: '1364582550135111771',
                      },
                      default: selfbotUser.voiceOptions.selfVideo,
                    },
                  ],
                  placeholder: selfbotUser.lang
                    ? "Choisis t'es options vocales"
                    : 'Select your voice options',
                  min_values: 0,
                  max_values: 3,
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
                  custom_id: 'apply_vcoptions',
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
                  ? `-# > Options appliquées avec succès! Vous pourrez réappliquer vos options vocales ${time(Math.floor(Date.now() / 1000) + 16, 'R')}`
                  : `-# > Options succesfully applied! You will be able to reaply your voice options ${time(Math.floor(Date.now() / 1000) + 16, 'R')}`,
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

    await selfbotUser.applyVoiceState();
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
                    custom_id: 'vcoptions',
                    options: [
                      {
                        label:
                          selfbotUser.lang === 'fr'
                            ? 'Couper le microphone'
                            : 'Cut the microphone',
                        value: 'mute',
                        description:
                          selfbotUser.lang === 'fr'
                            ? "Permet d'apparaitre avec le microphone coupé"
                            : 'Allows you to appear with the microphone cut',
                        emoji: {
                          id: '1364582553389891684',
                        },
                        default: selfbotUser.voiceOptions.selfMute,
                      },
                      {
                        label: selfbotUser.lang
                          ? 'Être en sourdine'
                          : 'Be deaf',
                        value: 'deaf',
                        description:
                          selfbotUser.lang === 'fr'
                            ? "Permet d'apparaitre en sourdine"
                            : 'Allows you to appear deaf',
                        emoji: {
                          id: '1364582551661838426',
                        },
                        default: selfbotUser.voiceOptions.selfDeaf,
                      },
                      {
                        label: selfbotUser.lang
                          ? 'Activer la caméra'
                          : 'Enable camera',
                        value: 'camera',
                        description:
                          selfbotUser.lang === 'fr'
                            ? "Permet d'apparaitre avec la caméra activée"
                            : 'Allows you to appear with the camera on',
                        emoji: {
                          id: '1364582550135111771',
                        },
                        default: selfbotUser.voiceOptions.selfVideo,
                      },
                    ],
                    placeholder: selfbotUser.lang
                      ? "Choisis t'es options vocales"
                      : 'Select your voice options',
                    min_values: 0,
                    max_values: 3,
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
                    custom_id: 'apply_vcoptions',
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
    }, 1000 * 15);
  },
};
