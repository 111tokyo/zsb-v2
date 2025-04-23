import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
  } from 'discord.js';
  import SelfbotUser from '../../src/classes/SelfbotUser';
  import { SlashCommand } from '../../src/types/interactions';
  
export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Permet de lancer une roulette avec un minimum et un maximum.')
        .setDescriptionLocalization(
            'fr',
            'Permet de lancer une roulette avec un minimum et un maximum.',
        )
        .addNumberOption(option =>
            option
                .setName('min')
                .setDescription('Le nombre minimum pour la roulette.')
                .setDescriptionLocalization(
                    'fr',
                    'Le nombre minimum pour la roulette.',
                )
                .setRequired(true),
        )
        .addNumberOption(option =>
            option
                .setName('max')
                .setDescription('Le nombre maximum pour la roulette.')
                .setDescriptionLocalization(
                    'fr',
                    'Le nombre maximum pour la roulette.',
                )
                .setRequired(true),
        ),

    execute: async (
        selfbotUser: SelfbotUser,
        interaction: ChatInputCommandInteraction,
    ) => {
        const min = interaction.options.getNumber('min', true);
        const max = interaction.options.getNumber('max', true);

        if (min >= max) {
            await interaction.reply({
                content:
                    selfbotUser.lang === 'fr'
                        ? `Le minimum doit être inférieur au maximum.`
                        : `The minimum must be less than the maximum.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const result = Math.floor(Math.random() * (max - min + 1)) + min;

        await interaction.reply({
            content:
                selfbotUser.lang === 'fr'
                    ? `Ettt, je tire... ${result}`
                    : `And, I draw... ${result}`,
            flags: MessageFlags.Ephemeral,
        });
     
    },
};
  