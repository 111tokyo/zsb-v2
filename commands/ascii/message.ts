import { time } from 'discord.js';
import { text as txt } from 'figlet';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (!args[0]) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez spécifier un texte à convertir! (*Exemple*: \`${selfbotUser.prefix}ascii caca\`)**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must specify a text to convert! (*Exemple*: \`${selfbotUser.prefix}ascii poop\`)**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

    const text = args.join(' ');

    txt(text, (err: any, result: any) => {
      if (err) {
        message.edit(
          selfbotUser.lang === 'fr'
            ? `**Une erreur est survenue lors de la génération de l'ASCII**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**An error occurred while generating ASCII**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
        );
        return;
      }

      message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `\`\`\`\n${result}\n\`\`\`\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `\`\`\`\n${result}\n\`\`\`\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
    });
  },
};
