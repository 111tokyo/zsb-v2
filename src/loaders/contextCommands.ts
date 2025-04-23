import Selfbot from '../classes/Selfbot';
import { ContextMenu } from '../types/interactions';

export const loadContextMenu = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const contextMenuFile: { contextMenu: ContextMenu } = await import(
    `../../..commands/${interactionSubPath}/context`
  );

  selfbot.contextMenuInteraction.set(
    contextMenuFile.contextMenu.data.name,
    contextMenuFile.contextMenu,
  );

  selfbot.application!.commands.create(contextMenuFile.contextMenu.data);
};
