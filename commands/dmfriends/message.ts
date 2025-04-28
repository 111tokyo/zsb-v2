import { MessageFlags, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();
    const friends = selfbotUser.relationships.friendCache.size;

    if (friends === 0) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous n'avez pas d'amis!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You don't have any friends!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

    const msg = await user
      ?.send({
        flags: MessageFlags.IsComponentsV2,
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
                    emoji: {
                      id: '1366475326569582633',
                    },
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
        ? `**Vous pouvez gérer votre dmall dans vos MPs**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `**You can manage your dmall in you DMs**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    );

    setTimeout(
      async () => {
        await msg.delete().catch(() => null);
      },
      1000 * 60 * 2,
    );
  },
};
