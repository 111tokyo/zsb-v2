import { MessageFlags } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
    interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? 'Pour réinitialiser votre token Discord, il vous suffit de changer votre mot de passe (même si vous remettez le même). Attention: cela vous déconnectera de ZSB, pensez donc à vous reconnecter après!'
          : 'To reset your Discord token, simply change your password (even if you use the same one again). Note: this will log you out of ZSB, so make sure to log back in afterwards!',
      flags: MessageFlags.Ephemeral,
    });
  },
};
