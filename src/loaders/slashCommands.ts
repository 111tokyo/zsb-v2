import { Client, SlashCommandBuilder } from 'discord.js';
import Selfbot from '../classes/Selfbot';
import { SlashCommand } from '../types/interactions';

export const slashCommands = new Map<string, any[]>();

export const settingUpSlashCommands = (selfbot: Client) => {
  slashCommands.forEach((subCommands: any[], commandName: string) => {
    let slashCommand: SlashCommandBuilder;

    if (subCommands[0] instanceof SlashCommandBuilder) {
      slashCommand = subCommands[0]
        .setIntegrationTypes([1])
        .setContexts([0, 1, 2]);
    } else {
      slashCommand = new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(commandName)
        .setIntegrationTypes([1])
        .setContexts([0, 1, 2]);

      subCommands.forEach(subCommand => {
        slashCommand.addSubcommand(subCommand);
      });
    }

    selfbot.application!.commands.create(slashCommand);
  });
};

export const loadSlashCommand = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const slashCommandFile: { slashCommand: SlashCommand } = await import(
    `../../commands/${interactionSubPath}/slash`
  );

  if (slashCommands.has(interactionSubPath.split('/')[0])) {
    const existingCommands = slashCommands.get(
      interactionSubPath.split('/')[0],
    )!;
    existingCommands.push(slashCommandFile.slashCommand.data);
    slashCommands.set(interactionSubPath.split('/')[0], existingCommands);
  } else {
    slashCommands.set(interactionSubPath.split('/')[0], [
      slashCommandFile.slashCommand.data,
    ]);
  }

  selfbot.slashCommandInteraction.set(
    slashCommandFile.slashCommand.data.name,
    slashCommandFile.slashCommand,
  );
};
