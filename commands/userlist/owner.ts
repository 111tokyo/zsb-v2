import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageActionRowComponentBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from 'discord.js';
import { OwnerCommand } from '../../src/types/interactions';

export const ownerCommand: OwnerCommand = {
    async execute(selfbot, message, _args: string[], page: number = 0) {
        const users = selfbot.selfbotUsers.keys();
        const usersList = Array.from(users).map(user => selfbot.selfbotUsers.get(user)).filter(Boolean);
        
        const itemsPerPage = 10;
        const totalPages = Math.ceil(usersList.length / itemsPerPage);
        const currentPage = Math.max(0, Math.min(page, totalPages - 1));
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, usersList.length);
        const currentUsers = usersList.slice(startIndex, endIndex);

        const components = [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`-# ➜ *${usersList.length} users* `),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
        ];

        for (const username of currentUsers) {
            const user = await selfbot.users.fetch(username!.user!.id!);
            components[0].addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(user.displayAvatarURL())
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`> __${username?.user?.username}__ (**\`${user.id}\`**)`),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            );
        }

        components[0].addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        ).addActionRowComponents(
            new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji({
                            id: "1366064859258556446",
                        })
                        .setCustomId("prev_page")
                        .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel(`${currentPage + 1}/${totalPages}`)
                        .setCustomId("zizidesnayz")
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji({
                            id: "1366064861548642425",
                        })
                        .setCustomId("next_page")
                        .setDisabled(currentPage >= totalPages - 1),
                ),
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        );

        if(!message.channel.isSendable()) return;

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: components
        });
    },
};
