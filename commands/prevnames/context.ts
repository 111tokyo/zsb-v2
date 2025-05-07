import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageFlags,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { prevnamesRequest } from '../../src/lib/prevnames';
import { ContextCommand } from '../../src/types/interactions';
import { Prevname } from '../../src/types/prevnames';

export const contextCommand: ContextCommand<UserContextMenuCommandInteraction> = {
    data: new ContextMenuCommandBuilder()
        .setName('Previous Names')
        .setType(ApplicationCommandType.User),

    execute: async (
        selfbotUser: SelfbotUser,
        interaction: UserContextMenuCommandInteraction,
    ) => {
        const userId = interaction.targetUser.id;
        const itemsPerPage = 10;
        let currentPage = 1;

        const generateEmbed = async (page: number, names: Prevname[]) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const namesList = names.slice(start, end);

            const namesString =
                namesList.length > 0
                    ? namesList
                        .map(
                            (name: Prevname, index: number) =>
                                `> ${start + index + 1}. **\`${name.name}\`** — <t:${Math.floor(
                                    new Date(name.date * 1000).getTime() / 1000,
                                )}:R>`,
                        )
                        .join('\n')
                    : selfbotUser.lang === 'fr'
                        ? `Aucun résultat trouvé.`
                        : `No results found.`;

            return {
                type: 17,
                accent_color: null,
                spoiler: false,
                components: [
                    {
                        type: 10,
                        content: namesString,
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1,
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
                                custom_id: 'previous',
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
                                custom_id: 'next',
                            },
                        ],
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1,
                    },
                ] as any,
            };
        };

        const prevnames = await prevnamesRequest(userId);
        const names = prevnames.filter(
            (name: Prevname) =>
                name.name != '' && name.name && name.source === 'names' && name.date,
        );
        names.sort((a: Prevname, b: Prevname) => b.date - a.date);

        const totalPages = Math.max(1, Math.ceil(names.length / itemsPerPage));
        let embed = await generateEmbed(currentPage, names);

        const msg = await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: [embed],
        });

        if (totalPages > 1) {
            const filter = (i: any) => i.user.id === interaction.user.id;
            const collector = msg?.createMessageComponentCollector({
                filter,
                time: 1000 * 60 * 2,
            });

            collector?.on('collect', async i => {
                if (i.customId === 'previous') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

                embed = await generateEmbed(currentPage, names);
                await i.update({ components: [embed] });
            });
        }
    },
};
