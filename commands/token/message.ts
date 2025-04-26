import { MessageFlags, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const msg = await user
      ?.send({
        flags: [MessageFlags.IsComponentsV2],
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
      })
      .catch(() => null);

    if (!msg) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Vous pouvez retrouver votre token Discord en MP**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `**You can retrieve your Discord token in DM**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    );

    setTimeout(
      async () => {
        await msg.delete().catch(() => null);
      },
      1000 * 60 * 2,
    );
  },
};
