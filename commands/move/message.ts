import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const targetUser = await selfbotUser.users.cache.get(targetId)?.fetch();

    if (!targetUser) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cette utilisateur n'existe pas ou est inaccessible! (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `userinfo ${message.guild?.members.cache.first()?.id}\`` : '\`userinfo [userId/userMention]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**This user doesn't exist or is inaccessible!**  ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [voiceChannel]\`'})\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    return;
  },
};
