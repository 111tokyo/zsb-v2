import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';
import * as figlet from 'figlet';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Converts text to ASCII art')
        .setDescriptionLocalization('fr', 'Convertit du texte en art ASCII')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to convert')
                .setDescriptionLocalization('fr', 'Le texte à convertir')
                .setRequired(true)),

    execute: async (
        selfbotUser: SelfbotUser,
        interaction: ChatInputCommandInteraction,
    ) => {
        const text = interaction.options.getString('text', true);

        figlet.text(text, (err: any, result: any) => {
            if (err) {
                interaction.reply({
                    content: selfbotUser.lang === 'fr'
                        ? 'Une erreur est survenue lors de la génération de l\'ASCII'
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
