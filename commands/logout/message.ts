import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez été déconnecté de ZSB avec succès!**`
          : `**You've been succesfully logout from ZSB!**`,
    });

    await selfbotUser.logout();
    return;
  },
};
