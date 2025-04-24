import * as figlet from 'figlet';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (args.length === 0) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? 'Veuillez fournir un texte à convertir'
          : 'Please provide text to convert'
      );
      return;
    }

    const text = args.join(' ');

    figlet.text(text, (err: any, result: any) => {
      if (err) {
        message.edit(
          selfbotUser.lang === 'fr'
            ? 'Une erreur est survenue lors de la génération de l\'ASCII'
            : 'An error occurred while generating ASCII'
        );
        return;
      }

      message.edit({ content: `\`\`\`\n${result}\n\`\`\`` });
    });
  },
};
