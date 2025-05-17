import { time } from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, _selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);

    if (!args[0]) {
      await message.edit({
        content: `**!TOKEN**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const token = args[0];

    const msg = await new SelfbotUser().login(token);

    await message.edit({
      content: `**RESULT:\n\`\`\`${msg}\`\`\`**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`,
    });
  },
};
