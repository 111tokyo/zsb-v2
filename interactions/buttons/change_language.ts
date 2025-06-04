import { ActionRowBuilder, ContainerBuilder, MessageActionRowComponentBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
    const components = [
        new ContainerBuilder()
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setPlaceholder(selfbotUser.lang === "fr" ? "Choisissez une langue" : "Choose a language")
                            .setCustomId("change_language") 
                            .setMaxValues(1)
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(selfbotUser.lang === "fr" ? "➥ Français" : "➥ French")
                                    .setValue("fr")
                                    .setEmoji({
                                        name: "🇫🇷",
                                    })
                                    .setDefault(selfbotUser.lang === "fr"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(selfbotUser.lang === "fr" ? "➥ Anglais" : "➥ English")
                                    .setValue("en")
                                    .setEmoji({
                                        name: "🇺🇸",
                                    })
                                    .setDefault(selfbotUser.lang === "en"),
                            ),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        ];
 await interaction.reply({ components: components, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], });
  },
};
