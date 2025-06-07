import { Modal } from '../../src/types/interactions';
import { selfbotUsersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { MessageFlags } from 'discord.js';

export const button: Modal = {
  execute: async (selfbotUser, interaction) => {

    const prefix = interaction.fields.getTextInputValue('message');

    if (prefix === selfbotUser.prefix) {
      await interaction.reply({ content: selfbotUser.lang === 'fr' ? "Le préfixe est déjà celui-ci!" : "The prefix is already this one!", flags: MessageFlags.Ephemeral });
      return;
    }
    if (prefix.length > 10) {
      await interaction.reply({ content: selfbotUser.lang === 'fr' ? "Le préfixe doit être inférieur à 10 caractères!" : "The prefix must be less than 10 characters!", flags: MessageFlags.Ephemeral });
      return;
    }
    selfbotUser.prefix = prefix;

    await db
    .update(selfbotUsersTable)
    .set({
      prefix: prefix,
    })
    .where(eq(selfbotUsersTable.id, selfbotUser.user!.id))
    .execute();
    
    await interaction.reply({ content: selfbotUser.lang === 'fr' ? "Le préfixe a été changé avec succès, rafraichis l'embed pour avoir les nouveaux changements !" : "The prefix has been changed successfully, refresh the embed to have the new changes !", flags: MessageFlags.Ephemeral });
    
    return;
  },
};
