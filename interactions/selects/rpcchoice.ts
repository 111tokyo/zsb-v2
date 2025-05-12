import { Select } from '../../src/types/interactions';

export const button: Select = {
  execute: async (selfbotUser, interaction) => {
    interaction.deferUpdate();
    const values = interaction.values;

    if (values.length === 1 && values.includes('no_status')) {
      selfbotUser.statusOptions.choice = null;
    } else if (values.length === 1) {
      selfbotUser.statusOptions.choice = values[0];
    } else {
      selfbotUser.statusOptions.choice = values;
    }
  },
};
