import Selfbot from '../classes/Selfbot';
import { OwnerCommand } from '../types/interactions';

export const loadOwnerCommand = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const ownerCommandName = interactionSubPath.replace('/', '-');
  const ownerCommandFile: { ownerCommand: OwnerCommand } = await import(
    `../../commands/${interactionSubPath}/owner`
  );
  console.log(ownerCommandFile);
  const ownerCommand = ownerCommandFile.ownerCommand;
  selfbot.ownerCommandInteraction.set(ownerCommandName, ownerCommand);
};
