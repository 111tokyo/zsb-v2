import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un thème! (*Exemple*: \`${selfbotUser.prefix}set-theme dark\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a theme! (*Exemple*: \`${selfbotUser.prefix}set-theme dark\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (args[0].toLowerCase() !== 'dark' && args[0].toLowerCase() !== 'light') {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le thème doit être "__Dark__" ou "__Light__"!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**The theme must be "__Dark__" or "__Light__"!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (args[0].toLowerCase() === selfbotUser.settings.theme) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous avez déjà sélectionné ce thème!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You have already selected this theme!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    await selfbotUser.settings.setTheme(
      args[0].toLowerCase() as 'dark' | 'light',
    );

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez changé votre thème en \`${args[0][0].toUpperCase() + args[0].slice(1)}\` avec succès!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You have successfully changed your theme to \`${args[0][0].toUpperCase() + args[0].slice(1)}\`!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });
  },
};
