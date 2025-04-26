import Selfbot from '../classes/Selfbot';
import { ContextCommand } from '../types/interactions';

export const loadContextMenu = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const contextMenuFile: { contextCommand: ContextCommand } = await import(
    `../../commands/${interactionSubPath}/context`
  );

  selfbot.contextMenuInteraction.set(
    contextMenuFile.contextCommand.data.name,
    contextMenuFile.contextCommand,
  );

  selfbot.application!.commands.create(
    contextMenuFile.contextCommand.data
      .setIntegrationTypes([1])
      .setContexts([0, 1, 2]),
  );
};
