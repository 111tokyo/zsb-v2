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
    .setName('clear')
    .setDescription('Allows you to delete messages.')
    .setDescriptionLocalization('fr', 'Permet de supprimer des messages.')
    .addIntegerOption(option =>
      option
        .setName('number')
        .setDescription('The number of messages to delete.')
        .setDescriptionLocalization('fr', 'Le nombre de messages à supprimer.')
        .setMaxValue(99)
        .setMinValue(1)
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const number = interaction.options.getInteger('number', true);

    const channelId = interaction.channelId;
    const channel = (await selfbotUser.channels.cache
      .get(channelId)
      ?.fetch()) as TextChannel;

    const msg = await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous êtes entrain de supprimer \`${number}\` messages...`
          : `You are deleting \`${number}\` messages...`,
      flags: MessageFlags.Ephemeral,
    });

    const messages = await channel.messages
      .fetch({
        limit: number + 1,
      })
      .then(messages => messages.filter(message => message.id !== msg.id));

    while (messages.size < number) {
      const fetchedMessages = await channel.messages.fetch({
        limit: number - messages.size,
      });
      messages.concat(fetchedMessages.filter(message => message.id !== msg.id));
    }

    let count = 0;

    const deletePromises = Array.from(messages.values()).map(async message => {
      count++;
      await message.delete().catch(() => {
        count--;
      });
    });

    await Promise.all(deletePromises);

    if (count === 0) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Il n'y avait aucun message à supprimer.`
            : `There were no messages to delete.`,
      });
    } else {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous avez supprimé \`${count}\` messages avec succès!`
            : `You have successfully deleted \`${count}\` messages!`,
      });
    }
  },
};
