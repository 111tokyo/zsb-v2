import { time } from 'discord.js';
import { MessageFlags } from 'discord.js-selfbot-v13';
import { selfbot } from '../../main';
import config from '../../src/config';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `## › ZSB Selfbot\n\n> **Commands:** \`${selfbot.messageCommandInteraction.size}\`\n> **Users:** \`${selfbot.userNb}\`\n\n**Support: ${config.supportServerInvite}\nCommande d'aide: \`${selfbotUser.prefix}help\`**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `## › ZSB Selfbot\n\n> **Commands:** \`${selfbot.messageCommandInteraction.size}\`\n> **Users:** \`${selfbot.userNb}\`\n\n**Support: ${config.supportServerInvite}\nHelp command: \`${selfbotUser.prefix}help\`**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      flags: MessageFlags.FLAGS.SUPPRESS_EMBEDS,
    });
  },
};
