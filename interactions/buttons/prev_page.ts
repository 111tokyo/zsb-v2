import { ContainerBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { selfbot } from "../../main";
import { Button } from "../../src/types/interactions";

export const button: Button = {
    execute: async (_selfbotUser, interaction) => {
    const message = interaction.message as any;
    const pageLabel = message.components?.[0]?.components?.[1]?.data?.label || "1/1";
    const [currentPage]: [ currentPage: number ] = pageLabel.split('/').map(Number);
    const newPage = Math.max(0, currentPage - 2);

    const users = selfbot.selfbotUsers.keys();
    const usersList = Array.from(users).map(user => selfbot.selfbotUsers.get(user)).filter(Boolean);
    const totalPages = Math.ceil(usersList.length / 4);
    const startIndex = newPage * 4;
    const endIndex = Math.min(startIndex + 4, usersList.length);
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

    for (const user of currentUsers) {
        components[0].addSectionComponents(
            new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`> **${user?.user?.username}** (**\`${user?.user?.id}\`**)\n> **CommandType:** **\`${user?.commandType}\`**\n> **Prefix:** **\`${user?.prefix}\`**\n> **Vocal:** **${user?.voice.connection?.channel ? user?.voice.connection?.channel : 'None'}**`),
            ),
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
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
                    .setDisabled(newPage === 0),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`${newPage + 1}/${totalPages}`)
                    .setCustomId("zizidesnayz")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji({
                        id: "1366064861548642425",
                    })
                    .setCustomId("next_page")
                    .setDisabled(newPage >= totalPages - 1),
            ),
    );

    await interaction.update({
        components: components
    });
  },
};