import { Message } from 'discord.js-selfbot-v13';

export interface SnipeMessage extends Message {
  avatarURL?: string | null;
}
