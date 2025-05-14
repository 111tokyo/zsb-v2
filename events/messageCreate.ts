import { time } from 'discord.js';
import { Message, MessageFlags } from 'discord.js-selfbot-v13';
import Selfbot from '../src/classes/Selfbot';
import SelfbotUser from '../src/classes/SelfbotUser';
import config from '../src/config';
import { Event } from '../src/types/event';

export const event: Event = {
  type: 'messageCreate',
  once: false,
  execute: async (
    selfbot: Selfbot,
    selfbotUser: SelfbotUser,
    message: Message,
  ) => {
    if (
      !selfbotUser.cooldowns.get(`afk_${message.author.id}`) &&
      message.author.id !== selfbotUser.user!.id &&
      selfbotUser.afk &&
      (message.channel.type === 'DM' ||
        message.content.includes(selfbotUser.user!.id))
    ) {
      message.reply(selfbotUser.afk);
      message.markRead();

      let afkCooldown;
      if (selfbotUser.cooldowns.get(`afk_${message.author.id}`)) {
        afkCooldown =
          selfbotUser.cooldowns.get(`afk_${message.author.id}`)! * 3;
      } else {
        afkCooldown = 1500;
      }

      selfbotUser.cooldowns.set(`afk_${message.author.id}`, afkCooldown);
      setTimeout(() => {
        selfbotUser.cooldowns.delete(`afk_${message.author.id}`);
      }, afkCooldown);
    }

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
        if (!command) return;

        if (!(await selfbotUser.guilds.fetch(config.supportServerId))) {
          const now = Math.floor(Date.now() / 1000);
          await message.edit({
            content:
              selfbotUser.lang === 'fr'
                ? `**Pour utiliser User.exe, vous devez être sur le [serveur de support](${config.supportServerInvite})!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**To use User.exe, you must be in the [support server](${config.supportServerInvite})!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            flags: [MessageFlags.FLAGS.SUPPRESS_EMBEDS],
          });
          setTimeout(async () => {
            await message.delete().catch(() => null);
          }, 15000);
          return;
        }

        if (selfbotUser.cooldowns.get(`messageCommand_${commandName}`)) {
          await message.react('🕐');
          setTimeout(async () => {
            await message.delete().catch(() => null);
          }, 7000);
          return;
        }

        await command!.execute(selfbot, selfbotUser, message, args);

        let commandCooldown;
        if (selfbotUser.cooldowns.get(`messageCommand_${commandName}`)) {
          commandCooldown =
            selfbotUser.cooldowns.get(`messageCommand_${commandName}`)! * 3;
        } else {
          commandCooldown = 1500;
        }

        selfbotUser.cooldowns.set(
          `messageCommand_${commandName}`,
          commandCooldown,
        );
        setTimeout(() => {
          selfbotUser.cooldowns.delete(`messageCommand_${commandName}`);
        }, commandCooldown);

        setTimeout(async () => {
          await message.delete().catch(() => null);
        }, 15000);
      }
    }
  },
};
