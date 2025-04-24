import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('faketoken')
        .setDescription('Generates a fake Discord token.')
        .setDescriptionLocalization('fr', 'Génère un faux token Discord.'),

    execute: async (
        selfbotUser: SelfbotUser,
        interaction: ChatInputCommandInteraction,
    ) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        const timestamp = Date.now().toString();
        const part1 = Buffer.from(timestamp).toString('base64').replace(/=/g, '');
        const part2 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const part3 = Array.from({ length: 27 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

        const fakeToken = `${part1}${part2}${part3}`;

        await interaction.reply({
            content: selfbotUser.lang === 'fr'
            ? `### Token généré : \`${fakeToken}\``
            : `### Generated token: \`${fakeToken}\``,
            flags: MessageFlags.Ephemeral,
        });

        return;
    },
};
