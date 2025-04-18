import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour executer cette commande!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un salon vocal à rejoindre! (*Exemple*: \`${selfbotUser.prefix}join \`${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ?? '\`[salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a voice channel to join! (*Exemple*: \`${selfbotUser.prefix}join ${'\`' + message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ?? '\`[salonVocal]\`'})**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const channelId = args[0].replace('<#', '').replace('>', '');
    const channel = selfbotUser.channels.cache.get(channelId)?.fetch();

    if (!channel) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Ce salon vocal n'existe pas ou est inaccessible! (*Exemple*: \`${selfbotUser.prefix}join \`${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ?? '\`[salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**This voice channel doesn't exist or is inaccessible! (*Exemple*: \`${selfbotUser.prefix}join \`${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ?? '\`[voiceChannel]\`'})**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }
  },
};
