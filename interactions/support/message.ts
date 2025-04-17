import { MessageCommand } from '../../src/types/interactions';
import config from "../../src/config"
import { time } from 'discord.js';
export const messageCommand: MessageCommand = {
  async execute(_selfbot, _selfbotUser, message, _args: string[]) {

   message.edit({ content: `Support: **${config.supportServerInvite}**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*` })
   
  },
};
