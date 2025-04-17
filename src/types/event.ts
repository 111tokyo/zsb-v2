import Selfbot from '../classes/Selfbot';
import SelfbotUser from '../classes/SelfbotUser';

export type Event = {
  type: string;
  once: boolean;
  execute: (selfbot: Selfbot, selfbotUser: SelfbotUser, ...args: any[]) => void;
};
