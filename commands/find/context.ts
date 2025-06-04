import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageFlags,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Guild, VoiceChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { ContextCommand } from '../../src/types/interactions';
import { UserData } from '../../src/types/user';

export const contextCommand: ContextCommand<UserContextMenuCommandInteraction> =
  {
    data: new ContextMenuCommandBuilder()
      .setName('Screen Message')
      .setType(ApplicationCommandType.User),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: UserContextMenuCommandInteraction,
    ) => {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const user = interaction.targetUser;
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
        await interaction.editReply({
          content:
            selfbotUser.lang === 'fr'
              ? `${user} n'est dans aucun salon vocal.`
              : `${user} isn't in any voice channel.`,
        });
        return;
      }

      const guildsIds = Array.from(
        data.mutual_guilds.map((guild: any) => guild.id),
      ) as string[];

      const results = [];
      for (const id of guildsIds) {
        const guild = (await selfbotUser.guilds.cache
          .get(id)
          ?.fetch()) as Guild;
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

      voiceChannel =
        results.find((channel): channel is VoiceChannel => channel !== null) ||
        null;
      foundInVoice = !!voiceChannel;

      if (foundInVoice && voiceChannel) {
        await interaction.editReply({
          content:
            selfbotUser.lang === 'fr'
              ? `${user} est connecté dans ${voiceChannel.toString()}.`
              : `${user} is in ${voiceChannel.toString()}.`,
        });
        return;
      }

      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `${user} n'est dans aucun salon vocal.`
            : `${user} isn't in any voice channel.`,
      });
      return;
    },
  };
