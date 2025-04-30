import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder
} from 'discord.js';
import { selfbot } from '../../main';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

const COMMANDS_PER_PAGE = 15;

export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands.')
        .setDescriptionLocalization('fr', 'Affiche toutes les commandes disponibles.'),

    execute: async (
        selfbotUser: SelfbotUser,
        interaction: ChatInputCommandInteraction,
    ) => {
        const commandhs = await selfbot.application!.commands.fetch();
        function findByName(name: string) {
            return commandhs.find((command) => command.name === name);
        }

        const allCommandsFR = Array.from(
            selfbot.slashCommandInteraction.values(),
        ).map((cmdName: SlashCommand) => {
            const commandid = findByName(cmdName.data.name)?.id;
            return (
                `- </${cmdName.data.name}:${commandid}>` +
                (cmdName.data.options && cmdName.data.options.length
                    ? ' ' +
                    cmdName.data.options
                        .map((o: any) => (o.required ? `[${o.name}]` : `<${o.name}>`))
                        .join(' ')
                    : '') +
                '\n' +
                `-# ┖ ${cmdName.data.description_localizations?.fr ?? cmdName.data.description}`
            );
        });

        const allCommandsEN = Array.from(
            selfbot.slashCommandInteraction.values(),
        ).map((cmdName: SlashCommand) => { 
            const commandid = findByName(cmdName.data.name)?.id;
            return (
                `- </${cmdName.data.name}:${commandid}>` +
                (cmdName.data.options && cmdName.data.options.length
                    ? ' ' +
                    cmdName.data.options
                        .map((o: any) => (o.required ? `[${o.name}]` : `<${o.name}>`))
                        .join(' ')
                    : '') +
                '\n' +
                `-# ┖ ${cmdName.data.description}`
            );
        });

        let currentPage = 1;
        const commands = selfbotUser.lang === 'fr' ? allCommandsFR : allCommandsEN;
        const totalPages = Math.max(1, Math.ceil(commands.length / COMMANDS_PER_PAGE));

        const getPageContent = (page: number) => {
            const start = (page - 1) * COMMANDS_PER_PAGE;
            const pageCommands = commands.slice(start, start + COMMANDS_PER_PAGE);
            const header =
                selfbotUser.lang === 'fr'
                    ? `Les options mises entre \`<...>\` sont obligatoires, contrairement aux options mis entre \`[...]\` qui sont facultatives.\n`
                    : `Options enclosed in \`<...>\` are mandatory, unlike options enclosed in \`[...]\`, which are optional.\n\n`;
            return header + pageCommands.join('\n');
        };

        const getComponents = (page: number) =>
            [
                {
                    type: 17,
                    accent_color: null,
                    spoiler: false,
                    components: [
                        {
                            type: 10,
                            content: getPageContent(page),
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 2,
                                    emoji: {
                                        id: '1366064859258556446',
                                    },
                                    disabled: page === 1,
                                    custom_id: 'help_back',
                                },
                                {
                                    type: 2,
                                    style: 2,
                                    label: `${page}/${totalPages}`,
                                    emoji: null,
                                    disabled: true,
                                    custom_id: 'page_indicator',
                                },
                                {
                                    type: 2,
                                    style: 2,
                                    emoji: {
                                        id: '1366064861548642425',
                                    },
                                    disabled: page === totalPages,
                                    custom_id: 'help_next',
                                },
                            ],
                        },
                    ],
                },
            ] as any;

        const msg = await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: getComponents(currentPage),
        })

        const collector = msg.createMessageComponentCollector({
            time: 1000 * 60 * 2,
        });

        collector.on('collect', async i => {
            if (i.customId === 'help_back' && currentPage > 1) {
                currentPage--;
            } else if (i.customId === 'help_next' && currentPage < totalPages) {
                currentPage++;
            }

            await i.update({
                components: getComponents(currentPage),
            });
        });

        collector.on('end', () => {
            msg.delete().catch(() => null);
        });

        await interaction.reply({
            content: selfbotUser.lang === 'fr'
                ? `**Vous pouvez voir la documentation dans vos MPs.**`
                : `**You can view the documentation in your DMs.**`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
