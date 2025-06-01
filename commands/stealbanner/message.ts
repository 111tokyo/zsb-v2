import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (selfbotUser.user?.premiumType !== 2) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez avoir le nitro pour voler la banniere!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must have nitro to steal the banner!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un utilisateur à voler la banniere!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a user to steal the banner!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    }
    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const targetUser = await selfbotUser.users.fetch(targetId);
    const targetBanner = targetUser.bannerURL({ dynamic: true });
    if (!targetBanner) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cet utilisateur n'a pas de banniere!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**This user doesn't have a banner!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    }
    await selfbotUser.user?.setBanner(targetBanner);
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**J'ai volé la banniere de ${targetUser}!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**I stole ${targetUser}'s banner!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
    return;
  },
};
