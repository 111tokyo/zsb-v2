import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import { VoiceBasedChannel } from 'discord.js-selfbot-v13';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

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
            ? `**Vous devez spécifier un salon vocal à rejoindre! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You must specify a voice channel to join! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [voiceChannel]\`'}\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const channelId = args[0].replace('<#', '').replace('>', '');
    const channel = (await selfbotUser.channels.cache
      .get(channelId)
      ?.fetch()) as VoiceBasedChannel | undefined;

    if (!channel) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Ce salon vocal n'existe pas ou est inaccessible! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**This voice channel doesn't exist or is inaccessible! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [voiceChannel]\`'})**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    const voiceConnection = await selfbotUser.voice
      .joinChannel(channel, {
        selfDeaf: selfbotUser.voiceOptions.selfDeaf,
        selfMute: selfbotUser.voiceOptions.selfMute,
        selfVideo: selfbotUser.voiceOptions.selfVideo,
      })
      .catch(() => null);

    if (!voiceConnection) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous ne pouvez pas rejoindre ce salon vocal! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**You can't join this voice channel! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [voiceChannel]\`'})**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      });
      return;
    }

    selfbotUser.voiceOptions.voiceChannelId = channel.id;

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez rejoint ${channel} avec succès!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You've succesfully joined ${channel}!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    });

    await db
      .update(selfbotUsersTable)
      .set({
        voiceOptions: JSON.stringify(selfbotUser.voiceOptions),
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
  },
};
