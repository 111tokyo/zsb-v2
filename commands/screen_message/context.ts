import { createCanvas, loadImage } from 'canvas';
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { ContextCommand } from '../../src/types/interactions';

export const contextCommand: ContextCommand<MessageContextMenuCommandInteraction> =
  {
    data: new ContextMenuCommandBuilder()
      .setName('Screen Message')
      .setType(ApplicationCommandType.Message),

    execute: async (
      selfbotUser: SelfbotUser,
      interaction: MessageContextMenuCommandInteraction,
    ) => {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const message = interaction.targetMessage;

      const author = await selfbotUser.users.cache
        .get(message.author.id)
        ?.fetch()!;

      const lines = message.content.split('\n');
      const lineHeight = 120;
      const baseHeight = 350;
      const canvasHeight = baseHeight + lines.length * lineHeight;

      const canvas = createCanvas(3000, canvasHeight * 1.3);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#2f3136';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar
      let avatarURL = author.displayAvatarURL({ format: 'png' });
      let avatarImage: any = null;

      try {
        avatarImage = await loadImage(avatarURL);
      } catch (err) {
        avatarImage = null;
      }

      if (avatarImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 300, 150, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 150, 150, 300, 300);
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 300, 150, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#72767d';
        ctx.fill();
        ctx.restore();
      }

      const pseudoX = 500;
      const pseudoY = 250;

      // Author name
      ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        message.author.displayName || message.author.username,
        pseudoX,
        pseudoY,
      );

      let currentX =
        pseudoX +
        ctx.measureText(message.author.displayName || message.author.username)
          .width +
        60;

      // Clan tag and logo
      const clanTag = author.clan?.tag?.replace('[', '').replace(']', '') || '';
      const clanLogoURL = author.clanBadgeURL?.() || '';
      let clanLogoImage: any = null;

      if (clanLogoURL) {
        try {
          clanLogoImage = await loadImage(clanLogoURL);
        } catch (err) {
          clanLogoImage = null;
        }
      }

      if (clanTag) {
        const tagFont = 'bold 80px "Noto Sans", Arial, sans-serif';
        ctx.font = tagFont;

        const tagPaddingX = 30;
        const tagPaddingY = 15;
        const tagHeight = 80;
        const tagTextWidth = ctx.measureText(clanTag).width;

        const logoSize = 60;
        const boxWidth = logoSize + 20 + tagTextWidth + tagPaddingX * 2;
        const boxHeight = tagHeight + tagPaddingY * 2;

        const tagY = pseudoY - boxHeight / 2 - 30; // petit ajustement vertical du fond

        // Fond du tag
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(currentX, tagY, boxWidth, boxHeight, 20);
        ctx.fill();

        // Logo du clan
        if (clanLogoImage) {
          const logoY = tagY + (boxHeight - logoSize) / 2 + 4;
          ctx.drawImage(
            clanLogoImage,
            currentX + tagPaddingX,
            logoY,
            logoSize,
            logoSize,
          );
        }

        // Texte du tag
        ctx.fillStyle = '#ffffff';
        ctx.font = tagFont;
        const logoOffsetX = currentX + tagPaddingX + logoSize + 20;
        ctx.fillText(clanTag, logoOffsetX, pseudoY);

        currentX += boxWidth + 50;
      }

      // Timestamp
      const createdAt = new Date(message.createdTimestamp);
      const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1).toString().padStart(2, '0')}/${createdAt.getFullYear()} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

      ctx.font = '80px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#72767d';
      ctx.fillText(formattedDate, currentX, pseudoY);

      // Message content
      ctx.font = '100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#dcddde';
      const firstLineY = 390;
      lines.forEach((line, index) => {
        ctx.fillText(line, 500, firstLineY + index * lineHeight);
      });

      const buffer = canvas.toBuffer('image/png');

      await interaction.editReply({
        files: [{ attachment: buffer, name: 'screen.png' }],
      });
    },
  };
