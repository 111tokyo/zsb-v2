import { ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from 'discord.js';
import { OwnerCommand } from '../../src/types/interactions';

export const ownerCommand: OwnerCommand = {
    async execute(selfbot, message, args: string[]) {
        if(!args[0]) {
            await message.reply(
                '**You must provide a user ID or mention!**',
             );
             return;
        }

        const userId = args[0]?.replace(/[<@!>]/g, '');
        const selfbotUser = selfbot.selfbotUsers.get(userId);

        if (!selfbotUser) {
            await message.reply(
               '**This user doesn\'t exist or is inaccessible or is not connected!**',
            );
            return;
        }
        if(selfbotUser.ws.ping === 0) { 
            await message.reply(
                '**This user is not connected, token is invalid, i\'m sending him a message to reconnect!**',
             );

             await selfbotUser.logout();
             return;
        }
        const container = new ContainerBuilder();
        
        if (selfbotUser.user?.bannerURL()) {
          container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
              new MediaGalleryItemBuilder().setURL(selfbotUser.user.bannerURL()!),
            ),
          );
        }
    
        container
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(true),
          )
          .addSectionComponents(
            new SectionBuilder()
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(selfbotUser.user?.avatarURL()!),
              )
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `> **${selfbotUser.user?.username}** (**\`${selfbotUser.user?.id}\`**)\n> **CommandType:** **\`${selfbotUser.commandType}\`**\n> **Prefix:** **\`${selfbotUser.prefix}\`**\n> **Vocal:** **${selfbotUser.voice.connection?.channel ? selfbotUser.voice.connection?.channel : 'None'}**`,
                ),
              ),
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(true),
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(true),
          );
    
    
        await message.reply({
          components: [container],
          flags: MessageFlags.IsComponentsV2,
        });
    
    },
};
