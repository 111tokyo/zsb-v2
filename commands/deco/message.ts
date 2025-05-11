import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const targetId = args[0]?.replace(/[<@!>]/g, '');
    const now = Math.floor(Date.now() / 1000);

    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour exécuter cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un utilisateur à déconnecter du salon vocal!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a user to disconnect from voice!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const guild = await selfbotUser.guilds.cache
      .get(message.guildId!)
      ?.fetch()!;
    const user = guild?.members.cache.get(targetId);

    if (!user) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cet utilisateur est introuvable ou inaccessible!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**This user doesn't exist or is inaccessible!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (!user.voice.channel) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**__${user.displayName || user.user.username}__ n'est pas dans un salon vocal!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**__${user.displayName || user.user.username}__ is not in a voice channel!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    try {
      await user.voice.disconnect();
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**__${user.displayName || user.user.username}__ a été déconnecté avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**__${user.displayName || user.user.username}__ was successfully disconnected!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    } catch (error) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'avez pas la permission de déconnecter cet utilisateur !**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You do not have permission to disconnect this user!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    }
  },
};
