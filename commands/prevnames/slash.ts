import {
    ChatInputCommandInteraction,
    CollectedInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';
import selfbotUser from '../../src/classes/SelfbotUser';
import { prevnamesRequest } from '../../src/lib/prevnames';
import { SlashCommand } from '../../src/types/interactions';
import { Prevname } from '../../src/types/prevnames';


export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('prevnames')
        .setDescription('Allows you to retrieve the previous names of a user.')
        .setDescriptionLocalization(
            'fr',
            "Permet d'obtenir les anciens noms d'un utilisateur.",
        )
        .addStringOption(option =>
            option
                .setDescription('The type of previous name to retrieve.')
                .setName('type')
                .setDescriptionLocalization(
                    'fr',
                    'Le type de nom précédent à récupérer.',
                )
                .addChoices(
                    {
                        name: '➥ Username',
                        value: 'username',
                    },
                    {
                        name: '➥ Displayname',
                        value: 'display',
                    },
                )
                .setRequired(true),
        )
        .addUserOption(option =>
            option
                .setDescription(
                    'The user that you want to retrieve the previous names.',
                )
                .setName('user')
                .setDescriptionLocalization(
                    'fr',
                    "L'utilisateur dont vous souhaitez obtenir les anciens noms.",
                )
                .setRequired(false),
        ),

    execute: async (
        selfbotUser: selfbotUser,
        interaction: ChatInputCommandInteraction,
    ) => {
        let userId = interaction.options.getUser('user')?.id;
        const type = interaction.options.getString('type');

        if (!userId) {
            userId = selfbotUser.user!.id;
        }

        const prevnames = await prevnamesRequest(userId)
        
        if (!prevnames) {
            await interaction.reply(
                selfbotUser.lang === 'fr'
                    ? `L'API est actuellement indisponible.`
                    : `The API is currently unavailable.`,
            );
            return;
        }

        let user = selfbotUser.users.cache.get(userId)!;

        if (!user) {
            user = await selfbotUser.users.cache.get(userId)?.fetch(true)!;
        }

        const itemsPerPage = 10;
        let currentPage = 1;
        const generateEmbed = async (page: number, names: Prevname[]) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const namesList = names.slice(start, end);

            const namesString = namesList.length > 0
                ? namesList
                    .map(
                        (name: Prevname, index: number) =>
                            `> ${start + index + 1}. **\`${name.name
                            }\`** — <t:${Math.floor(
                                new Date(name.date * 1000).getTime() / 1000
                            )}:R>`
                    )
                    .filter(Boolean)
                    .join("\n")
                : selfbotUser.lang === "fr"
                    ? `Aucun résultat trouvé.`
                    : `No results found.`

            const messageOptions = {
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
                                    id: "1366064859258556446",
                                },
                                disabled: page === 1,
                                custom_id: "previous"
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
                                    id: "1366064861548642425",
                                },
                                disabled: page === totalPages,
                                custom_id: "next"
                            }
                        ]
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1,
                    },
                ] as any
            };
            return messageOptions;
        };

        let names: Prevname[];
        switch (type) {
            case 'username':
                names = prevnames.filter(
                    (name: Prevname) =>
                        name.name != '' &&
                        name.name &&
                        name.source === 'names' &&
                        name.date,
                );

                break;
            case 'display':
            default:
                names = prevnames.filter(
                    (name: Prevname) =>
                        name.name != '' &&
                        name.name &&
                        name.source === 'display' &&
                        name.date,
                );
                break;
        }

        names.sort((a: Prevname, b: Prevname) => b.date - a.date);

        const totalPages = Math.max(1, Math.ceil(names.length / itemsPerPage));
        let embed = await generateEmbed(currentPage, names);

        const msg = await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: [embed],
        });

        if (totalPages > 1) {
            const filter: any = (i: CollectedInteraction) =>
                i.user.id === interaction.user.id;
            const collector = msg?.createMessageComponentCollector({
                filter,
                time: 1000 * 60 * 2,
            });

            collector?.on("collect", async (i) => {
                if (i.customId === "previous") {
                    currentPage--;
                } else if (i.customId === "next") {
                    currentPage++;
                }

                embed = await generateEmbed(currentPage, names);

                await i.update({ components: [embed] })

            }
            );
            collector?.on("end", async () => {
                await msg?.delete().catch(() => null);
            }
            );
            return;
        }
    }
}
