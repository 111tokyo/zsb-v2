import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Allows you to see the last deleted message of a channel.')
    .setDescriptionLocalization(
      'fr',
      "Permet de voir le dernier message supprimé d'un salon.",
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const snipedMessage = selfbotUser.snipe.get(interaction.channelId);

    if (!snipedMessage) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Aucun message n'a été supprimé dans ce salon.`
            : `No messages have been deleted in this channel.`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `__Envoyé par: ${snipedMessage.author}__\n\`\`\`${snipedMessage.content.replace('`', '')}\`\`\`\n<t:${Math.floor(
                snipedMessage.createdTimestamp / 1000,
              )}:R>`
            : `__Sent by: ${snipedMessage.author}__\n\`\`\`${snipedMessage.content.replace('`', '')}\`\`\`<t:${Math.floor(
                snipedMessage.createdTimestamp / 1000,
              )}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
