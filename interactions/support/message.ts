import { MessageCommand } from '../../src/types/interactions';
import config from '../../src/config';
import { time } from 'discord.js';
import { MessageFlags } from 'discord.js-selfbot-v13';
export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `Serveur support: **${config.supportServerInvite}**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `Support server: **${config.supportServerInvite}**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      flags: MessageFlags.FLAGS.SUPPRESS_EMBEDS,
    });
  },
};
