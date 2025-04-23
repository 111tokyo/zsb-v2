import Selfbot from '../classes/Selfbot';
import { MessageCommand } from '../types/interactions';

export const loadMessageCommand = async (
  selfbot: Selfbot,
  interactionSubPath: string,
) => {
  const messageCommandName = interactionSubPath.replace('/', '-');
  const messageCommandFile: { messageCommand: MessageCommand } = await import(
    `../../commands/${interactionSubPath}/message`
  );
  const messageCommand = messageCommandFile.messageCommand;
  selfbot.messageCommandInteraction.set(messageCommandName, messageCommand);
};
