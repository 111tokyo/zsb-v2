import SelfbotUser from '../../src/classes/SelfbotUser';
import { Modal } from '../../src/types/interactions';

export const button: Modal = {
    execute: async (_selfbotUser, interaction) => {
        await interaction.deferReply({ flags: 64 });
        const token = interaction.fields.getTextInputValue('token');

        const selfbotUser = new SelfbotUser()
        const response = await selfbotUser.login(token)
        switch (response) {
            case 'INVALID_TOKEN':
                await interaction.editReply({
                    content: `> The token is invalid.`,
                });
                break;
            case 'ALREADY_CONNECTED':
                await interaction.editReply({
                    content: `> You are already connected.`,
                });
                break;
            case token:
                await interaction.editReply({
                    content: `> You have been connected with success!`,
                });
                break;
        }
    },

    
};
