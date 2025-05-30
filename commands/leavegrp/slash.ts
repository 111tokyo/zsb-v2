import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../src/types/interactions';
import { GroupDMChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';

  export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName('leavegrp')
      .setDescription('Allows you to leave a group DM.')
      .setDescriptionLocalization('fr', 'Permet de quitter un groupe DM.'),
  
    execute: async (
      selfbotUser: SelfbotUser,
      interaction: ChatInputCommandInteraction,
    ) => {
      if (interaction.channel?.type !== ChannelType.GroupDM) {
        await interaction.reply({
          content:
            selfbotUser.lang === 'fr'
              ? `Vous devez être dans un groupe DM pour utiliser cette commande!`
              : `You must be in a group DM to use this command!`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const channel = await selfbotUser.channels.fetch(interaction.channelId)! as GroupDMChannel;
      await channel.leave(true)
  
      return;
    },
  };
  