import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { GroupDMChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('kickgrp')
    .setDescription('Allows you to kick a user from a group.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'expulser un utilisateur d'un groupe.",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to kick.')
        .setDescriptionLocalization('fr', "L'utilisateur à expulser.")
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const user = interaction.options.getUser('user')!;
    if (interaction.channel?.type !== ChannelType.GroupDM) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être dans un groupe pour utiliser cette commande!`
            : `You must be in a group to use this command!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const targetId = user.id;
    const targetChannel = (await selfbotUser.channels.cache
      .get(interaction.channelId)!
      .fetch()) as GroupDMChannel;
    const targetUser = targetChannel.recipients.get(targetId);

    if (targetChannel.ownerId !== selfbotUser.user!.id) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être le propriétaire du groupe pour expulser un utilisateur!`
            : `You must be the owner of the group to kick a user!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!targetUser) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Cet utilisateur n'est pas dans le groupe ou n'existe pas!`
            : `This user is not in the group or doesn't exist!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const channel = (await selfbotUser.channels.fetch(
      interaction.channelId,
    )!) as GroupDMChannel;

    await channel.removeUser(targetUser).catch(() => null);
    return;
  },
};
