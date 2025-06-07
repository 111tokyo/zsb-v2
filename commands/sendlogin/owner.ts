import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from 'discord.js';
import { OwnerCommand } from '../../src/types/interactions';
export const ownerCommand: OwnerCommand = {
  async execute(_selfbot, message, _args: string[]) {
    const components = [
      new ContainerBuilder()
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true),
        )
        .addSectionComponents(
          new SectionBuilder()
            .setButtonAccessory(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel('LogIn')
                .setCustomId('login'),
            )
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                '> 👋 Welcome to the login interface. Click the "LogIn" button to be logged in.',
              ),
            ),
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true),
        ),
    ];
    if (!message.channel.isSendable()) return;

    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: components,
    });
  },
};
