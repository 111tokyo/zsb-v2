import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { VoiceBasedChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Allows you to move a user into your voice channel.')
    .setDescriptionLocalization(
      'fr',
      'Permet de déplacer un utilisateur dans votre salon vocal.',
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to move into your voice channel.')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur à déplacer dans votre salon vocal.",
        )
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const targetUser = interaction.options.getUser('user', true);
    const guild = await selfbotUser.guilds.cache
      .get(interaction.guildId!)
      ?.fetch()!;

    if (!guild) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être sur un serveur pour executer cette commande!`
            : `You must be in a guild to execute this command!`,
      });
      return;
    }

    const targetMember = guild?.members.cache.get(targetUser.id)!;
    const selfMember = await guild.members.fetch(selfbotUser.user!.id)!;

    if (!selfMember.voice.channel) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être dans un salon vocal pour déplacer un utilisateur.`
            : `You must be in a voice channel to move a user.`,
      });
      return;
    }

    if (!targetMember.voice.channel) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `${targetMember} n'est pas dans un salon vocal.`
            : `${targetMember} is not in a voice channel.`,
      });
      return;
    }

    if (targetMember.voice.channel.id === selfMember.voice.channel.id) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `${targetMember} est déjà dans votre salon vocal.`
            : `${targetMember} is already in your voice channel.`,
      });
      return;
    }

    try {
      await targetMember.voice.setChannel(
        selfMember.voice.channel as VoiceBasedChannel,
      );
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous avez déplacé ${targetMember} avec succès!`
            : `You have succesfully moved ${targetMember}!`,
      });
    } catch {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'avez pas la permission de déplacer cet utilisateur.`
            : `You do not have permission to move this user.`,
      });
      return;
    }
  },
};
