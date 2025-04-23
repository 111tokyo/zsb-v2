import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { TextChannel } from 'discord.js-selfbot-v13';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('renew')
    .setDescription('Allows you to renew a channel.')
    .setDescriptionLocalization('fr', 'Permet de recréer un salon.'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez être sur un serveur pour executer cette commande!`
            : `You must be in a guild to execute this command!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const channelId = interaction.channelId;
    const channel = await selfbotUser.channels.cache.get(channelId)?.fetch()!;

    const newChannel = await (channel as TextChannel).clone().catch(() => null);

    if (!newChannel) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous n'avez pas les permissions nécéssaires pour recréé ${channel}!`
            : `You don't have the necessary permissions to renew ${channel}!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await channel.delete().catch(() => null);

    const newMessage = await newChannel.send('.');

    setTimeout(async () => {
      await newMessage.delete();
    }, 2 * 1000);
    return;
  },
};
