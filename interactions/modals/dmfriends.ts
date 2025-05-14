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
                  content:
                    selfbotUser.lang === 'fr'
                      ? `> Vous êtes en train d'envoyer le message à **\`${totalFriends}\`** amis...`
                      : `> You are sending the message to **\`${totalFriends}\`** friends...`,
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
                  content:
                    selfbotUser.lang === 'fr'
                      ? `> Vous avez envoyé envoyé le message à **\`${successCount}\`** amis avec succès!`
                      : `> You have succesfully sent the message to **\`${successCount}\`** friends!`,
    });
  },
};
