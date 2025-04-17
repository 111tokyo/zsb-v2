import { Message } from 'discord.js-selfbot-v13';
import Selfbot from '../src/classes/Selfbot';
import SelfbotUser from '../src/classes/SelfbotUser';
import { Event } from '../src/types/event';

export const event: Event = {
  type: 'messageDelete',
  once: false,
  execute: (_selfbot: Selfbot, selfbotUser: SelfbotUser, message: Message) => {
    if (!message) return;
    if (!message.author?.id) return;
    if (message.author?.id === selfbotUser.user!.id) return;
    if (message.author?.bot) return;
    selfbotUser.snipe.set(message.channel.id, message);
  },
};
