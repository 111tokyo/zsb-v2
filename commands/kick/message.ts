import { PermissionsBitField, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    let reason = 'No reason provided';
    const now = Math.floor(Date.now() / 1000);
    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour executer cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un utilisateur à expulsé!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a user to kick!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    const guild = await selfbotUser.guilds.cache.get(message.guildId!)?.fetch();
    const member = await guild?.members.fetch(message.author.id);
    if(!member?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous n'avez pas les permissions pour expulsé un utilisateur!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You do not have permission to kick a user!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    const user = await guild?.members.fetch(args[0]).catch(async () => {
        await message.edit({
          content:
            selfbotUser.lang === 'fr'
              ? `**L'utilisateur spécifié n'existe pas!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
              : `**The specified user does not exist!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
        });
        return;
          });
          if (!user) {
            await message.edit({
              content:
                selfbotUser.lang === 'fr'
                  ? `**L'utilisateur spécifié n'existe pas!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                  : `**The specified user does not exist!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            });
            return;
          }
      if(member.roles.highest.position <= user.roles.highest.position) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous ne pouvez pas expulsé un utilisateur qui a une rôle plus haut ou égal à votre rôle!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You cannot kick a user who has a role higher or equal to your role!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if(user.id === guild?.ownerId) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous ne pouvez pas expulsé le propriétaire du serveur!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You cannot kick the server owner!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    if (args[1]) {
      reason = args.slice(1).join(' ');
    }
    if(member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await message.guild?.members.kick(user, reason)
        await message.edit({
            content:
              selfbotUser.lang === 'fr'
                ? `**L'utilisateur ${user} a été expulsé avec succès!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**The user ${user} has been kicked successfully!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
          });
          return;
    } 
    return;
  },
};
