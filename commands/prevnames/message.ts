import { time } from 'discord.js';
import selfbotUser from '../../src/classes/SelfbotUser';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser: selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? "Cette commande n'est pas encore disponible.\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*"
          : `This command is not available yet.\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
  },
};
