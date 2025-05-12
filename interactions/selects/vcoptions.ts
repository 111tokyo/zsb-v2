import { Select } from '../../src/types/interactions';

export const button: Select = {
  execute: async (selfbotUser, interaction) => {
    interaction.deferUpdate();

    if (interaction.values.includes('mute')) {
      selfbotUser.voiceOptions.selfMute = true;
    }

    if (interaction.values.includes('deaf')) {
      selfbotUser.voiceOptions.selfDeaf = true;
    }

    if (interaction.values.includes('camera')) {
      selfbotUser.voiceOptions.selfVideo = true;
    }

    if (!interaction.values.includes('mute')) {
      selfbotUser.voiceOptions.selfMute = false;
    }

    if (!interaction.values.includes('deaf')) {
      selfbotUser.voiceOptions.selfDeaf = false;
    }

    if (!interaction.values.includes('camera')) {
      selfbotUser.voiceOptions.selfVideo = false;
    }
  },
};
