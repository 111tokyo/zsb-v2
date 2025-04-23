import { MessageCommand } from '../../src/types/interactions';
import { sendNewComponents } from '../../src/util/sendNewComponents';
import { time } from "discord.js"

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const msg = await sendNewComponents(
      user!.id,
      [
        {
          type: 17,
          accent_color: null,
          spoiler: true,
          components: [
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `Votre token discord:\`\`\`${selfbotUser.token}\`\`\``
                  : `Your discord token:\`\`\`${selfbotUser.token}\`\`\``,
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 9,
              accessory: {
                type: 2,
                style: 2,
                label:
                  selfbotUser.lang === 'fr'
                    ? 'Réinitialiser le token'
                    : 'Reset token',
                emoji: null,
                disabled: false,
                custom_id: 'reset_token',
              },
              components: [
                {
                  type: 10,
                  content:
                    selfbotUser.lang === 'fr'
                      ? "-# > Nous vous déconseillons fortement de partager votre token Discord avec d'autres utilisateurs. Des assaillants pourraient s'en servir pour pirater votre compte."
                      : '-# > We strongly advise you not to share your Discord token with other users. Attackers could use it to hack your Discord account.',
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `-# ➜ *Suppression du message ${time(
                      Math.floor(Date.now() / 1000) + 31,
                      'R',
                    )}*`
                  : `-# ➜ *Deleting message ${time(
                      Math.floor(Date.now() / 1000) + 31,
                      'R',
                    )}*`,
            },
          ],
        },
      ],
      user!.id,
      1000 * 30,
    );
    
    if(msg === "CLOSED_DMS"){
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return
    }
    
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous pouvez retrouver votre token discord en MP**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You can retrieve your discord token in DM**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
    }
  };

