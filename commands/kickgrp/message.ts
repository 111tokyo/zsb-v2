import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import { GroupDMChannel } from 'discord.js-selfbot-v13';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (message.channel.type !== 'GROUP_DM') {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être dans un groupe DM pour utiliser cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a group DM to use this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    if(!args[0]) {
        await message.edit({
            content:
              selfbotUser.lang === 'fr'
                ? `**Vous devez spécifier un utilisateur à expulser!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**You must specify a user to kick!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
          });
    }
    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const targetChannel = await selfbotUser.channels.cache.get(message.channel.id)?.fetch() as GroupDMChannel;
    const targetUser = targetChannel.recipients.get(targetId)

    if (targetChannel.ownerId !== selfbotUser.user!.id) {
        await message.edit({
            content:
              selfbotUser.lang === 'fr'
                ? `**Vous devez être le propriétaire du groupe DM pour expulser un utilisateur!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**You must be the owner of the group DM to kick a user!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
          });
    }
    
    if (!targetUser) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cet utilisateur n'est pas dans le groupe DM ou n'existe pas!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**This user is not in the group DM or doesn't exist!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const channel = message.channel as GroupDMChannel;
    await message.delete();

    await channel.removeUser(targetUser).catch(async () => {
        return;
    });
    return;
  },
};
