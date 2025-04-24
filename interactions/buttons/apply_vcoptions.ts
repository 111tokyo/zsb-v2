import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
    interaction.deferUpdate();
    selfbotUser.applyVoiceState();
  },
};
