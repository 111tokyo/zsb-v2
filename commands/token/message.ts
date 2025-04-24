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
        {
          type: 14,
          divider: true,
          spacing: 1,
        },
        {
          type: 10,
          content: selfbotUser.lang === 'fr'
            ? `-# > Votre token est privé, ne le partagez pas! Il peut être utilisé pour se connecter à votre compte discord!` 
            : `-# > Your token is private, do not share it! It can be used to log in to your discord account!`,
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
      ],
      user!.id,
      1000 * 30,
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
        ? `**Vous pouvez retrouver votre token discord en MP**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `**You can retrieve your discord token in DM**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    );
  },
};
