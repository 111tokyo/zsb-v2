import SelfbotUser from '../src/classes/SelfbotUser';
import { Event } from '../src/types/event';
import { Message } from 'discord.js-selfbot-v13';
import Selfbot from '../src/classes/Selfbot';

export const event: Event = {
  type: 'messageCreate',
  once: false,
  execute: (selfbot: Selfbot, selfbotUser: SelfbotUser, message: Message) => {
    if (selfbotUser.commandType !== 'Slash') {
      if (message.author.bot) return;
      if (message.author.id !== selfbotUser.user!.id) return;
      if (message.content.startsWith(selfbotUser.prefix)) {
        const commandName = message.content
          .slice(selfbotUser.prefix.length)
          .trim()
          .split(' ')[0];
        const args = message.content.slice(1).trim().split(' ').slice(1);
        const command = selfbot.messageCommandInteraction.get(commandName);
        try {
          command.execute(selfbot, selfbotUser, message, args);
          setTimeout(async () => {
            await message.delete().catch(() => null);
          }, 15000);
        } catch {}
      }
    }
  },
};
