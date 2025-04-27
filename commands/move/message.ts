import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const now = Math.floor(Date.now() / 1000);

    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour executer cette commande!**\n-# ➜ *Suppression du message ${time(Math.floor(now / 1000) + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(Math.floor(now / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const guild = await selfbotUser.guilds.cache.get(message.guildId!)?.fetch();
    const selfbotMember = await guild?.members.cache
      .get(selfbotUser.user!.id)
      ?.fetch();

    if (!selfbotMember?.voice.channel) {
      message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'êtes pas dans un salon vocal.\n-# ➜ *Suppression du message ${time(Math.floor(now / 1000) + 16, 'R')}*`
            : `You are not in a voice channel.\n-# ➜ *Deleting message ${time(Math.floor(now / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const user = guild!.members.cache.get(targetId);

    if (!user) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Cette utilisateur n'existe pas ou est inaccessible! (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `userinfo ${message.guild?.members.cache.first()?.id}\`` : '\`userinfo [userId/userMention]\`'})**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**This user doesn't exist or is inaccessible!** (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `userinfo ${message.guild?.members.cache.first()?.id}\`` : '\`userinfo [userId/userMention]\`'})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );
      return;
    }

    if (!user?.voice.channel) {
      message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cette utilisateur n'est pas dans un salon vocal!**\n-# ➜ *Suppression du message ${time(Math.floor(now / 1000) + 16, 'R')}*`
            : `**Cette utilisateur is not in a voice channel!**\n-# ➜ *Deleting message ${time(Math.floor(now / 1000) + 16, 'R')}*`,
      });
      return;
    }

    try {
      user.voice.setChannel(selfbotMember.voice.channel.id).catch(() => null);
      message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous avez déplacer l'utilisateur avec succes!**\n-# ➜ *Suppression du message ${time(Math.floor(now / 1000) + 16, 'R')}*`
            : `**You !**\n-# ➜ *Deleting message ${time(Math.floor(now / 1000) + 16, 'R')}*`,
      });
    } catch {
      message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'avez pas la permission de déplacer cet utilisateur!**\n-# ➜ *Suppression du message ${time(Math.floor(now / 1000) + 16, 'R')}*`
            : `**You do not have permission to move this user!**\n-# ➜ *Deleting message ${time(Math.floor(now / 1000) + 16, 'R')}*`,
      });
      return;
    }
    
    return;
  },
};
