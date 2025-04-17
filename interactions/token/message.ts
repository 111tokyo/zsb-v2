import { EmbedBuilder, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const embed = new EmbedBuilder()
      .setColor('NotQuiteBlack')
      .setDescription(
        selfbotUser.lang === 'fr'
          ? `-# > Nous vous deconseillons grandement de partager votre token Discord avec d'autres utilisateurs, des assaillant pourrai s'en servir pour pirater votre compte Discord.\n\n**VOTRE TOKEN:** \n-# \`\`\`${selfbotUser.token}\`\`\`\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 31, 'R')}*`
          : `-# > We strongly advise you not to share your Discord token with other users. Attackers could use it to hack your Discord account.\n\n**YOUR TOKEN:** \n-# \`\`\`${selfbotUser.token}\`\`\`\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 31, 'R')}*`,
      );

    const pvMessage = await user?.send({ embeds: [embed] }).catch(async () => {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
    });

    if (pvMessage) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Votre token discord a été envoyé ici: ${pvMessage.url}**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**Your discord token has been sent here: ${pvMessage.url}**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      setTimeout(async () => {
        await pvMessage.delete().catch(() => null);
      }, 30000);
    }
  },
};
