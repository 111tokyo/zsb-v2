import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `## › Vos paramètres:\n> **Préfixe:** \`${selfbotUser.prefix}\`\n> **Type de commande:** \`${selfbotUser.commandType}\`\n> **Langue:** \`${selfbotUser.lang}\`\n> **Type de compte:** \`Standard\`\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `## › Your settings:\n> **Prefix:** \`${selfbotUser.prefix}\`\n> **Command type:** \`${selfbotUser.commandType}\`\n> **Language:** \`${selfbotUser.lang}\`\n> **Account type:** \`Standard\`\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });
    return;
  },
};
