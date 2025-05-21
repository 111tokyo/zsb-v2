import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
    execute: async (_selfbotUser, interaction) => {

        const modal = new ModalBuilder()
            .setTitle("Login.exe")
            .setCustomId("login");

        const messageInput = new TextInputBuilder()
            .setCustomId("token")
            .setLabel(
                "Token"
            )
            .setRequired(true)
            .setMaxLength(512)
            .setPlaceholder(
                "......................."
            )
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
            messageInput
        );

        modal.addComponents(row);

        await interaction.showModal(modal);


    },
};
