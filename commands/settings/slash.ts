import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContainerBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    MessageActionRowComponentBuilder,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SlashCommandBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,
  } from 'discord.js';
  import SelfbotUser from '../../src/classes/SelfbotUser';
  import { SlashCommand } from '../../src/types/interactions';
  
  export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName('settings')
      .setDescription('Allows you to have a look at the settings of the selfbot.')
      .setDescriptionLocalization('fr', 'Permet de voir les paramètres du selfbot.'),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: ChatInputCommandInteraction,
    ) => {
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

        await interaction.reply({ components: [container], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], });
    },
  };
  