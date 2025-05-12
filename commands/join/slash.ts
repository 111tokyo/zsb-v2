import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { VoiceBasedChannel } from 'discord.js-selfbot-v13';
import { eq } from 'drizzle-orm';
import SelfbotUser from '../../src/classes/SelfbotUser';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Allows you to join a voice channel.')
    .setDescriptionLocalization('fr', 'Permet de rejoindre un salon vocal.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel that you want to join.')
        .setDescriptionLocalization(
          'fr',
          'Le salon que vous souhaitez rejoindre.',
        )
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const channelId = interaction.options.getChannel('channel', true).id;
    const channel = (await selfbotUser.channels.cache
      .get(channelId)
      ?.fetch()) as VoiceBasedChannel;

    const voiceConnection = await selfbotUser.voice
      .joinChannel(channel, {
        selfDeaf: selfbotUser.voiceOptions.selfDeaf,
        selfMute: selfbotUser.voiceOptions.selfMute,
        selfVideo: selfbotUser.voiceOptions.selfVideo,
      })
      .catch(() => null);

    if (!voiceConnection) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous ne pouvez pas rejoindre ce salon vocal!`
            : `You can't join this voice channel!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    selfbotUser.voiceOptions.voiceChannelId = channel.id;

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez rejoint ${channel} avec succès!`
          : `You've succesfully joined ${channel}!`,
      flags: MessageFlags.Ephemeral,
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
