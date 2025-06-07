import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageActionRowComponentBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from 'discord.js';
import { OwnerCommand } from '../../src/types/interactions';

export const ownerCommand: OwnerCommand = {
    async execute(selfbot, message, _args: string[]) {
        const users = selfbot.selfbotUsers.keys();
        const usersList = Array.from(users).map(user => selfbot.selfbotUsers.get(user)).filter(Boolean);
        
        const itemsPerPage = 4;
        const totalPages = Math.ceil(usersList.length / itemsPerPage);
        const currentPage = 0;
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
            components[0].addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`> **${username?.user?.username}** (**\`${username?.user?.id}\`**)\n> **CommandType:** **\`${username?.commandType}\`**\n> **Prefix:** **\`${username?.prefix}\`**\n> **Vocal:** **${username?.voice.connection?.channel ? username?.voice.connection?.channel : 'None'}**`),
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
