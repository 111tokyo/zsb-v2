import { deleteUserByToken } from '../../src/db/actions';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez été déconnecté de ZSB avec succès!**`
          : `**You've been succesfully logout from ZSB!**`,
    });

    await deleteUserByToken(selfbotUser.token!);
    await selfbotUser.deauthorize(selfbot.user!.id);
    selfbotUser.removeAllListeners().destroy();
    selfbot.selfbotUsers.delete(selfbotUser.user!.id);
    return;
  },
};
