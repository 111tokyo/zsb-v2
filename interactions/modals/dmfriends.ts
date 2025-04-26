import { userMention } from 'discord.js';
import { Modal } from '../../src/types/interactions';

export const button: Modal = {
    execute: async (selfbotUser, interaction) => {
        await interaction.deferReply({ flags: 64 });

        const friends = Array.from(selfbotUser.relationships.friendCache.values()).filter(Boolean);
        const totalFriends = friends.length;

        await interaction.editReply({
            components: [
                {
                    type: 17,
                    accent_color: null,
                    spoiler: false,
                    components: [
                        ...(selfbotUser.user?.bannerURL()
                            ? [
                                {
                                    type: 12,
                                    items: [
                                        {
                                            media: {
                                                url: selfbotUser.user?.bannerURL({ size: 4096 }),
                                            },
                                            description: null,
                                            spoiler: false,
                                        },
                                    ],
                                },
                            ]
                            : []),
                        {
                            type: 9,
                            accessory: {
                                type: 11,
                                media: {
                                    url: selfbotUser.user?.displayAvatarURL({ size: 4096 }),
                                },
                                description: null,
                                spoiler: false,
                            },
                            components: [
                                {
                                    type: 10,
                                    content:
                                        selfbotUser.lang === 'fr'
                                            ? `> Vous êtes en train d'envoyer le message à **\`${totalFriends}\`** amis...`
                                            : `> You are sending the message to **\`${totalFriends}\`** friends...`,
                                },
                            ],
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
                                    label:
                                        selfbotUser.lang === 'fr'
                                            ? 'Envoyer le message'
                                            : 'Send the message',
                                    emoji: null,
                                    disabled: true,
                                    custom_id: 'dmfriends',
                                },
                            ],
                        },
                        {
                            type: 14,
                            divider: true,
                            spacing: 1,
                        },
                    ],
                },
            ] as any,
        });

        let successCount = 0;
        const message = interaction.fields.getTextInputValue("message");

        for (const friend of friends) {
            try {
                const dmChannel = await selfbotUser.users.createDM(friend.id).catch(() => null);
                if (!dmChannel) continue;
                await dmChannel.send(
                    message.replace(/(\{user\})/g, userMention(friend.id))
                );
                successCount++;
            } catch { }
            await selfbotUser.sleep(1337);
        }

        const int = await interaction.editReply({
            components: [
                {
                    type: 17,
                    accent_color: null,
                    spoiler: false,
                    components: [
                        ...(selfbotUser.user?.bannerURL()
                            ? [
                                {
                                    type: 12,
                                    items: [
                                        {
                                            media: {
                                                url: selfbotUser.user?.bannerURL({ size: 4096 }),
                                            },
                                            description: null,
                                            spoiler: false,
                                        },
                                    ],
                                },
                            ]
                            : []),
                        {
                            type: 9,
                            accessory: {
                                type: 11,
                                media: {
                                    url: selfbotUser.user?.displayAvatarURL({ size: 4096 }),
                                },
                                description: null,
                                spoiler: false,
                            },
                            components: [
                                {
                                    type: 10,
                                    content:
                                        selfbotUser.lang === 'fr'
                                            ? `> Message envoyé à **\`${successCount}\`** amis!`
                                            : `> Message sent to **\`${successCount}\`** friends!`,
                                },
                            ],
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
                                    label:
                                        selfbotUser.lang === 'fr'
                                            ? 'Envoyer le message'
                                            : 'Send the message',
                                    emoji: null,
                                    disabled: true,
                                    custom_id: 'dmfriends',
                                },
                            ],
                        },
                        {
                            type: 10,
                            content:
                                selfbotUser.lang === 'fr'
                                    ? `> Vous pouvez refaire un dmall que dans 10minutes.`
                                    : `> You can do another dmall in 10 minutes.`,
                        },
                        {
                            type: 14,
                            divider: true,
                            spacing: 1,
                        },
                    ],
                },
            ] as any,

        });

        setTimeout(async () => {
            await int.edit({
                components: [
                    {
                        type: 17,
                        accent_color: null,
                        spoiler: false,
                        components: [

                            {
                                type: 10,
                                content:
                                    selfbotUser.lang === 'fr'
                                        ? `> Vous voulez vraiment envoyer un message à vos **\`${totalFriends}\`** amis?`
                                        : `> Do you really want to send a message to your **\`${totalFriends}\`** friends?`,
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
                                        label:
                                            selfbotUser.lang === 'fr'
                                                ? 'Envoyer le message'
                                                : 'Send the message',
                                        emoji: null,
                                        disabled: false,
                                        custom_id: 'dmfriends',
                                    },
                                ],
                            },
                            {
                                type: 14,
                                divider: true,
                                spacing: 1,
                            },
                        ],
                    },
                ] as any,

            });
        }, 1000 * 60 * 10);
    },
};

