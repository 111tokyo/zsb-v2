import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
    execute: async (selfbotUser, interaction) => {

        const modal = new ModalBuilder()
            .setTitle(selfbotUser.lang === "fr" ? "Changer le préfixe" : "Change prefix")
            .setCustomId("change_prefix");

        const messageInput = new TextInputBuilder()
            .setCustomId("message")
            .setLabel(
                selfbotUser.lang === "fr"
                    ? "Nouveau préfixe"
                    : "New prefix"
            )
            .setRequired(true)
            .setMaxLength(512)
            .setPlaceholder(
                selfbotUser.lang === "fr"
                    ? "Exemple: !"
                    : "Example: !"
            )
            .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
            messageInput
        );

        modal.addComponents(row);

        await interaction.showModal(modal);


    },
};
