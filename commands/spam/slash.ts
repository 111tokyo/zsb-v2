import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { TextChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Allows you to send a message multiple times quickly.')
    .setDescriptionLocalization(
      'fr',
      "Permet d'envoyer un message plusieurs fois rapidement.",
    )
    .addIntegerOption(option =>
      option
        .setName('number')
        .setDescription(
          'The number of times you want to send the message. (max: 50)',
        )
        .setDescriptionLocalization(
          'fr',
          'Le nombre de fois que vous souhaitez envoyer le message. (max: 50)',
        )
        .setMaxValue(50)
        .setMinValue(1)
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The message content to spam.')
        .setDescriptionLocalization('fr', 'Le contenu du message à spammer.')
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const number = interaction.options.getInteger('number', true);
    const message = interaction.options.getString('message', true);

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous êtes entrain de spammer \`${number}\` messages...`
          : `You are spamming \`${number}\` messages...`,
      flags: MessageFlags.Ephemeral,
    });

    const channelId = interaction.channelId;
    const channel = (await selfbotUser.channels.cache
      .get(channelId)
      ?.fetch()) as TextChannel;

    const count = number;
    const spamContent = message;

    await Promise.all(
      Array.from({ length: count }).map(() => channel.send(spamContent)),
    );

    await interaction.editReply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez spammé \`${count}\` messages avec succès!`
          : `You have successfully spammed \`${count}\` messages!`,
    });
  },
};
