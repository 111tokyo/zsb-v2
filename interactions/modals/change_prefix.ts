import { Modal } from '../../src/types/interactions';
import { selfbotUsersTable } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import db from '../../src/db';
import { ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ThumbnailBuilder, TextDisplayBuilder, ActionRowBuilder, MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, MessageFlags} from 'discord.js';

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
    
    const container = new ContainerBuilder();

        if (selfbotUser.user?.bannerURL()) {
        container.addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL(selfbotUser.user.bannerURL()!)
                    )
            );
        }

        container
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(selfbotUser.user?.avatarURL()!)
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`> **${selfbotUser.user?.username}** (**\`${selfbotUser.user?.id}\`**)\n> **CommandType:** **\`${selfbotUser.commandType}\`**\n> **Prefix:** **\`${selfbotUser.prefix}\`**\n> **Vocal:** **${selfbotUser.voice.connection?.channel ? selfbotUser.voice.connection?.channel : 'None'}**`),
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(selfbotUser.lang === 'fr' ? "Préfixe" : "Prefix")
                            .setEmoji({
                                id: "1366475326569582633",
                            })
                            .setCustomId("change_prefix"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(selfbotUser.lang === 'fr' ? "Langue" : "Language")
                            .setEmoji({
                                id: "1365695166668603433",
                            })
                            .setCustomId("change_language"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(selfbotUser.lang === 'fr' ? "Type de commande" : "Command type")
                            .setEmoji({
                                id: "1358367017639612466",
                            })
                            .setCustomId("change_command_type"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(selfbotUser.lang === 'fr' ? "Rafraîchir" : "Refresh")
                            .setEmoji({
                                id: "1356288411878690917",
                            })
                            .setCustomId("refresh_settings"),
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            );

    await interaction.message?.edit({ components: [container] });
    return;
  },
};
