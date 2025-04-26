import { MessageFlags, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const targetUser = await selfbot.users.cache.get(targetId)?.fetch();

    const now = Math.floor(Date.now() / 1000);

    if (!targetUser) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Cette utilisateur n'existe pas ou est inaccessible! (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `pic ${message.guild?.members.cache.first()?.id}\`` : '\`pic [userId/userMention]\`'})**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**This user doesn't exist or is inaccessible!** (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `pic ${message.guild?.members.cache.first()?.id}\`` : '\`pic [userId/userMention]\`'})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );
      return;
    }

    const avatar = targetUser?.avatarURL({
      extension: 'png',
      size: 2048,
    });

    const msg = await user?.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 12,
              items: [
                {
                  media: {
                    url: avatar,
                  },
                  description: null,
                  spoiler: false,
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label:
                    selfbotUser.lang === 'fr'
                      ? "URL de l'avatar"
                      : 'Avatar URL',
                  emoji: {
                    id: '1365681835807608832',
                  },
                  disabled: false,
                  url: avatar,
                },
              ],
            },
          ],
        },
      ] as any,
    });

    if (!msg) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );
      return;
    }

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Vous pouvez voir la photo de profil dans vos MPs.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
        : `**You can view the profil picture in your DMs.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    );

    setTimeout(
      async () => {
        await msg.delete().catch(() => null);
      },
      1000 * 60 * 2,
    );
  },
};
