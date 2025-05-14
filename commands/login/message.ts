import { time } from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);

    const owners = [
      '1361345963175968779',
      '944242927528460338',
      '1130887236976660551',
    ];

    if (!owners.includes(selfbotUser.user!.id)) return;

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
