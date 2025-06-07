import { time, VoiceChannel } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import { UserData } from '../../src/types/user';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0]) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Vous devez spécifier un utilisateur à voler l'avatar!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**You must specify a user to steal the avatar!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
    }
    const targetId = args[0]?.replace(/[<@!>]/g, '');
    const user = await selfbotUser.users.fetch(targetId);
    let foundInVoice = false;
    let voiceChannel: VoiceChannel | null = null;

    const response = await fetch(
      `https://discord.com/api/v9/users/${user.id}/profile?type=modal&with_mutual_guilds=true&with_mutual_friends=false&with_mutual_friends_count=true`,
      {
        method: 'GET',
        headers: {
          Authorization: selfbotUser.token!,
          'Content-Type': 'application/json',
        },
      },
    );

    const data: UserData = await response.json();
    if (!data || !data.mutual_guilds || data.mutual_guilds.length === 0) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `${user} n'est dans aucun salon vocal.\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `${user} isn't in any voice channel.\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    const guildsIds = Array.from(
      data.mutual_guilds.map((guild: any) => guild.id),
    ) as string[];

    const results = [];
    for (const id of guildsIds) {
      const guild = await selfbotUser.guilds.cache.get(id)?.fetch();
      if (!guild) continue;
      const member = await guild.members.cache.get(user.id)?.fetch();
      if (!member) continue;
      const selfbotMember = await guild.members.cache
        .get(selfbotUser.user!.id)
        ?.fetch();
      if (!selfbotMember) continue;
      if (member.voice.channel instanceof VoiceChannel) {
        const channel = member.voice.channel;
        if (selfbotMember.permissionsIn(channel).has('VIEW_CHANNEL')) {
          results.push(channel);
          break;
        }
      }
    }
    voiceChannel = results[0] || null;
    foundInVoice = !!voiceChannel;

    if (foundInVoice && voiceChannel) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `${user} est connecté dans ${voiceChannel.toString()}.\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `${user} is in ${voiceChannel.toString()}.\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `${user} n'est dans aucun salon vocal.\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `${user} isn't in any voice channel.\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    });
    return;
  },
};
