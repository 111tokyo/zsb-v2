import { MessageFlags } from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { Modal } from '../../src/types/interactions';

export const button: Modal = {
  execute: async (_selfbotUser, interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const token = interaction.fields.getTextInputValue('token');

    const response = await new SelfbotUser().login(token);

    if (!response) {
      await interaction.editReply({
        content: `An error occured!`,
      });
    }

    switch (response) {
      case 'INVALID_TOKEN':
        await interaction.editReply({
          content: `The token you provided is invalid!`,
        });
        break;
      case 'ALREADY_CONNECTED':
        await interaction.editReply({
          content: `You are already connected to User.exe!`,
        });
        break;
      case token:
        await interaction.editReply({
          content: `You have been connected successfully!`,
        });
        break;
    }
  },
};
