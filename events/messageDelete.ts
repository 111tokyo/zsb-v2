import Selfbot from '../src/classes/Selfbot';
import SelfbotUser from '../src/classes/SelfbotUser';
import { Event } from '../src/types/event';
import { SnipeMessage } from '../src/types/snipe';

export const event: Event = {
  type: 'messageDelete',
  once: false,
  execute: (
    _selfbot: Selfbot,
    selfbotUser: SelfbotUser,
    message: SnipeMessage,
  ) => {
    if (!message) return;
    if (!message.author?.id) return;
    //if (message.author?.id === selfbotUser.user!.id) return;
    if (message.author?.bot) return;

    message.avatarURL = message.author.displayAvatarURL({
      format: 'png',
      size: 4096,
    });

    const snipes = selfbotUser.snipe.get(message.channel!.id);
    selfbotUser.snipe.set(
      message.channel.id,
      snipes ? [message, ...snipes].slice(0, 10) : [message],
    );
  },
};
