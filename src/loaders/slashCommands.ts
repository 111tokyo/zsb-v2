import Selfbot from '../classes/Selfbot';
import { SlashCommand } from '../types/interactions';

export const loadSlashCommand = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const slashCommandFile: { slashCommand: SlashCommand } = await import(
    `../../commands/${interactionSubPath}/slash`
  );

  selfbot.slashCommandInteraction.set(
    slashCommandFile.slashCommand.data.name,
    slashCommandFile.slashCommand,
  );

  selfbot.application!.commands.create(
    slashCommandFile.slashCommand.data
      .setIntegrationTypes([1])
      .setContexts([0, 1, 2]),
  ).catch((err) => {
    console.error(
      err,
    );
  });
};
