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
                            .setPlaceholder(selfbotUser.lang === "fr" ? "Choisissez un type de commande" : "Choose a command type")
                            .setCustomId("change_command_type")
                            .setMaxValues(1)
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(selfbotUser.lang === "fr" ? "➥ Both" : "➥ Both")
                                    .setValue("both")
                                    .setDefault(selfbotUser.commandType === "Both"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(selfbotUser.lang === "fr" ? "➥ Slash" : "➥ Slash")
                                    .setValue("slash")
                                    .setDefault(selfbotUser.commandType === "Slash"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(selfbotUser.lang === "fr" ? "➥ Préfixe" : "➥ Prefix")
                                    .setValue("prefix")
                                    .setDefault(selfbotUser.commandType === "Prefix"),
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
