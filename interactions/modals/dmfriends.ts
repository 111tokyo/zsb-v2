import { Modal } from '../../src/types/interactions';

type Relationship = [string, number];

export const button: Modal = {
  execute: async (selfbotUser, interaction) => {
    await interaction.deferReply({ flags: 64 });

    const relationships = await selfbotUser.relationships.fetch() as any;
    const entries = Array.from(relationships.cache.entries()) as Relationship[];
    const friends = entries
      .filter(([_, type]) => type === 1)
      .map(([id]) => id);
    
    const totalFriends = friends.length;
    const message = interaction.fields.getTextInputValue('message');

    await interaction.editReply({
      content:
        selfbotUser.lang === 'fr'
          ? `> Vous êtes en train d'envoyer le message à **\`${totalFriends}\`** amis...`
          : `> You are sending the message to **\`${totalFriends}\`** friends...`,
    });

    let successCount = 0;

    for (const friendId of friends) {
      try {
        const dmChannel = await selfbotUser.users
          .createDM(friendId)
          .catch(() => null);
        if (!dmChannel) continue;
        await dmChannel.send({ content: message })
        successCount++;
      } catch {
      }
      await selfbotUser.sleep(1337);
    }

    await interaction.editReply({
      content:
        selfbotUser.lang === 'fr'
          ? `> Vous avez envoyé le message à **\`${successCount}\`** amis avec succès!`
          : `> You have successfully sent the message to **\`${successCount}\`** friends!`,
    });
  },
};
