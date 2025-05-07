import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, _args: string[]) {
    await message.edit({
      content:
        selfbotUser.lang === 'fr'
          ? `**Vous avez été déconnecté de User.exe avec succès!**`
          : `**You've been succesfully logout from User.exe!**`,
    });

    await selfbotUser.logout();
    return;
  },
};
