import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageFlags,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { ContextCommand } from '../../src/types/interactions';

export const contextCommand: ContextCommand<UserContextMenuCommandInteraction> =
  {
    data: new ContextMenuCommandBuilder()
      .setName('Previous Names')
      .setType(ApplicationCommandType.User),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: UserContextMenuCommandInteraction,
    ) => {
      interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? "Cette commande n'est pas encore disponible."
            : 'This command is not available yet.',
        flags: MessageFlags.Ephemeral,
      });
    },
  };
