import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('deco')
    .setDescription('Allows you to disconnect a user from a voice channel.')
    .setDescriptionLocalization(
      'fr',
      "Permet de déconnecter un utilisateur d'un salon vocal.",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to disconnect from the voice channel')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur à déconnecter du salon vocal.",
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

    const member = guild?.members.cache.get(targetUser.id)!;

    if (!member.voice.channel) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `${member} n'est pas dans un salon vocal.`
            : `${member} is not in a voice channel.`,
      });
      return;
    }

    try {
      await member.voice.disconnect();
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous avez déconnecté ${member} avec succès!`
            : `You have successfully disconnected ${member}!`,
      });
    } catch {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'avez pas la permission de déconnecter cet utilisateur.`
            : `You do not have permission to disconnect this user.`,
      });
    }
  },
};
