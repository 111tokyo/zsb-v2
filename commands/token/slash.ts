import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  time,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { sendNewComponents } from '../../src/util/sendNewComponents';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('token')
    .setDescription('Allows you to see your discord token')
    .setDescriptionLocalization('fr', 'Permet de voir votre token discord'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const user = await interaction.client.users.cache
      .get(selfbotUser.user!.id)
      ?.fetch();

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
      await interaction.reply(
        selfbotUser.lang === 'fr'
          ? `Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!`
          : `You must enable your private messages to use this feature!`,
      );
      return
    }

    await interaction.editReply({
      content:
        selfbotUser.lang === 'fr'
          ? 'Vous pouvez retrouver votre token discord en MP'
          : 'You can retrieve your discord token in DM',
    });
  },
};
