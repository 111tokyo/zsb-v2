import { time, userMention } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, args: string[]) {
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un utilisateur à qui récupérer le token! (*Exemple*: \`${selfbotUser.prefix}tokengrab 1139950543113048236\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a user to grab the token! (*Exemple*: \`${selfbotUser.prefix}tokengrab 1139950543113048236\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const userId = args[0].replace(/[<@!>]/g, '');

    const user = await selfbot.users.cache.get(userId)?.fetch();

    if (!user) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**L'utilisateur spécifié n'existe pas ou est inaccessible!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**The specified user doesn't exist or is inaccessible!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const decoded = Buffer.from(userId).toString('base64').replace('==', '');

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Le token discord de ${userMention(userId)} commence par: \`${decoded}-----------------------------------------\`**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**The discord token of ${userMention(userId)} starts with: \`${decoded}-----------------------------------------\`**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });
  },
};
