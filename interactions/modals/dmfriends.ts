import { MessageFlags, userMention } from 'discord.js';
import { Modal } from '../../src/types/interactions';

export const button: Modal = {
  execute: async (selfbotUser, interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let successCount = 0;
    const totalFriends = selfbotUser.relationships.friendCache.size;
    const message = interaction.fields.getTextInputValue("message");
    
      await interaction.editReply({
        content:
        selfbotUser.lang === "fr"
            ? `Vous êtes en train d'envoyer le message à \`${totalFriends}\` amis...`
            : `You are sending the message to \`${totalFriends}\` friends...`,
      });
    

    const friends = Array.from(selfbotUser.relationships.friendCache.values()).filter(Boolean);

    for (const friend of friends) {
        try {
            const dmChannel = await selfbotUser.users.createDM(friend.id).catch(() => null);
            if (!dmChannel) continue;
            await dmChannel.send(
                message.replace(/(\{user\})/g, userMention(friend.id))
            );
            successCount++;
        } catch {}
        await selfbotUser.sleep(1337);
    }

      await interaction.editReply({
        content:
        selfbotUser.lang === "fr"
            ? `Vous avez envoyé le message à \`${successCount}/${totalFriends}\` amis avec succès !`
            : `You successfully have sent the message to \`${successCount}/${totalFriends}\` friends!`,
      });
    
  },
};

