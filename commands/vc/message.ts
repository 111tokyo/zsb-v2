import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import { sendNewComponents } from '../../src/util/sendNewComponents';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const msg = await sendNewComponents(
      user!.id,
      [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
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
                        id: '1364590640557457408',
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
              type: 1,
              components: [
                {
                  type: 2,
                  style: 1,
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
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? "-# ➜ N'oubliez pas que vous devez avoir les permissons pour rejoindre la vocale."
                  : "-# ➜ Don't forget that you must have the permissions to join the voice channel.",
            },
          ],
        },
      ],
      user!.id,
      1000 * 60 * 2,
    );

    if (msg === 'CLOSED_DMS') {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Vous pouvez gérer vos options vocales en MP**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `**You can manage your voice options in DM**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    );
  },
};
