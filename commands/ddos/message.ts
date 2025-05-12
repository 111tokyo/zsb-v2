import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
   
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Cette commande est réservé aux utilisateurs premium!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**This command is reserved for premium users!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      }); 
  },
};
