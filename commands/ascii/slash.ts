import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { text as txt } from 'figlet';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Allows you to converts a text to ASCII art.')
    .setDescriptionLocalization(
      'fr',
      'Permet de convertir un texte en art ASCII.',
    )
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('The text you want to convert.')
        .setDescriptionLocalization(
          'fr',
          'Le texte que vous souhaitez convertir.',
        )
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const text = interaction.options.getString('text', true);

    txt(text, (err: any, result: any) => {
      if (err) {
        interaction.reply({
          content:
            selfbotUser.lang === 'fr'
              ? "Une erreur est survenue lors de la génération de l'ASCII"
              : 'An error occurred while generating ASCII',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      interaction.reply({
        content: `\`\`\`\n${result}\n\`\`\``,
        flags: MessageFlags.Ephemeral,
      });
    });
  },
};
