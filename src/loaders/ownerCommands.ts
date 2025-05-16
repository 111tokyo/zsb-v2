import Selfbot from '../classes/Selfbot';
import { OwnerCommand } from '../types/interactions';

export const loadOwnerCommand = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const messageCommandName = interactionSubPath.replace('/', '-');
  const ownerCommandFile: { ownerCommand: OwnerCommand } = await import(
    `../../commands/${interactionSubPath}/owner`
  );
  const ownerCommand = ownerCommandFile.ownerCommand;
  selfbot.ownerCommandInteraction.set(messageCommandName, ownerCommand);
};
