import { ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ThumbnailBuilder, TextDisplayBuilder, ActionRowBuilder, MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, MessageFlags, time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const now = Math.floor(Date.now() / 1000);
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

        const user = await selfbot.users.cache.get(selfbotUser.user!.id)!.fetch();

        const msg = await user.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });

        if (!msg) {
            await message.edit(
              selfbotUser.lang === 'fr'
                ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            );
            return;
          }
      
          await message.edit(
            selfbotUser.lang === 'fr'
              ? `**Vous pouvez gérer vos paramètres dans vos MPs**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
              : `**You can manage your settings in your DMs**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
          );
      
          setTimeout(
            async () => {
              await msg.delete().catch(() => null);
            },
            1000 * 60 * 2,
          );
  },
};

