import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import SelfbotUser from '../../src/classes/SelfbotUser';
import db from '../../src/db';
import { selfbotUsersTable } from '../../src/db/schema';
import { CommandType, SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('setcommand')
    .setDescription('Allows you to set your command type.')
    .setDescriptionLocalization(
      'fr',
      'Permet de définir votre type de commande.',
    )
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The command type you want to set.')
        .setDescriptionLocalization(
          'fr',
          'Le type de commande que vous souhaitez définir.',
        )
        .setChoices([
          {
            name: '➥ Slash',
            value: 'Slash',
          },
          {
            name: '➥ Prefix',
            value: 'Prefix',
          },
          {
            name: '➥ Both',
            value: 'Both',
          },
        ])
        .setRequired(true),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const commandType = interaction.options.getString(
      'type',
      true,
    ) as CommandType;

    if (commandType === selfbotUser.commandType) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous avez déjà sélectionné ce type de commande!`
            : `You have already selected this command type!`,
      });
      return;
    }

    selfbotUser.commandType = commandType;

    await interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? `Vous avez changé votre type de commande en \`${commandType}\` avec succès!`
          : `You have successfully changed your command type to \`${commandType}\`!`,
      flags: MessageFlags.Ephemeral,
    });

    if (commandType === 'Prefix') {
      selfbotUser.deauthorize(interaction.client.user.id);
    } else {
      selfbotUser.installUserApps(interaction.client.user.id);
    }

    await db
      .update(selfbotUsersTable)
      .set({
        commandType: commandType,
      })
      .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
      .execute();
  },
};
