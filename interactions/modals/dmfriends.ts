import { userMention } from 'discord.js';
import { Modal } from '../../src/types/interactions';

export const button: Modal = {
  execute: async (selfbotUser, interaction) => {
    await interaction.deferReply({ flags: 64 });

    const friends = Array.from(
      selfbotUser.relationships.friendCache.values(),
    ).filter(Boolean);

    const totalFriends = friends.length;

    await interaction.editReply({
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 9,
              accessory: {
                type: 11,
                media: {
                  url: selfbotUser.user?.displayAvatarURL({ size: 4096 }),
                },
                description: null,
                spoiler: false,
              },
              components: [
                {
                  type: 10,
                  content:
                    selfbotUser.lang === 'fr'
                      ? `> Vous êtes en train d'envoyer le message à **\`${totalFriends}\`** amis...`
                      : `> You are sending the message to **\`${totalFriends}\`** friends...`,
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label:
                    selfbotUser.lang === 'fr'
                      ? 'Envoyer le message'
                      : 'Send the message',
                  emoji: {
                    id: '1366475326569582633',
                  },
                  disabled: true,
                  custom_id: 'dmfriends',
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
          ],
        },
      ] as any,
    });

    let successCount = 0;
    const message = interaction.fields.getTextInputValue('message');

    for (const friend of friends) {
      try {
        const dmChannel = await selfbotUser.users
          .createDM(friend.id)
          .catch(() => null);
        if (!dmChannel) continue;
        await dmChannel.send(
          message.replace(/(\{user\})/g, userMention(friend.id)),
        );
        successCount++;
      } catch {}
      await selfbotUser.sleep(1337);
    }

    await interaction.editReply({
      components: [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 9,
              accessory: {
                type: 11,
                media: {
                  url: selfbotUser.user?.displayAvatarURL({ size: 4096 }),
                },
                description: null,
                spoiler: false,
              },
              components: [
                {
                  type: 10,
                  content:
                    selfbotUser.lang === 'fr'
                      ? `> Vous avez envoyé envoyé le message à **\`${successCount}\`** amis avec succès!`
                      : `> You have succesfully sent the message to **\`${successCount}\`** friends!`,
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label:
                    selfbotUser.lang === 'fr'
                      ? 'Envoyer le message'
                      : 'Send the message',
                  emoji: {
                    id: '1366475326569582633',
                  },
                  disabled: true,
                  custom_id: 'dmfriends',
                },
              ],
            },
            {
              type: 10,
              content:
                selfbotUser.lang === 'fr'
                  ? `> Vous pouvez refaire un dmall que dans 10minutes.`
                  : `> You can do another dmall in 10 minutes.`,
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
          ],
        },
      ] as any,
    });
  },
};
