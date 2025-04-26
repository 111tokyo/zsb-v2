import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
    execute: async (selfbotUser, interaction) => {

        const modal = new ModalBuilder()
            .setTitle(selfbotUser.lang === "fr" ? "› DM amis" : "› DM friends")
            .setCustomId("dmfriends");

        const messageInput = new TextInputBuilder()
            .setCustomId("message")
            .setLabel(
                selfbotUser.lang === "fr"
                    ? "Message DmFriends"
                    : "DmFriends Message"
            )
            .setRequired(true)
            .setMaxLength(512)
            .setPlaceholder(
                selfbotUser.lang === "fr"
                    ? "{user} pour mentionner votre ami"
                    : "{user} to mention your friend"
            )
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
            messageInput
        );

        modal.addComponents(row);

        await interaction.showModal(modal);


    },
};
