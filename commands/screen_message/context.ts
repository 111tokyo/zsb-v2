import { createCanvas, Image, loadImage } from 'canvas';
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { ContextCommand } from '../../src/types/interactions';

function formatDate(date: Date) {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

async function loadImageSafe(url?: string): Promise<Image | null> {
  if (!url) return null;
  try {
    return await loadImage(url);
  } catch {
    return null;
  }
}

function drawAvatar(
  ctx: import('canvas').CanvasRenderingContext2D,
  img: Image | null,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  if (img) {
    ctx.clip();
    ctx.drawImage(img as unknown as any, x, y, size, size);
  } else {
    ctx.fillStyle = '#72767d';
    ctx.fill();
  }
  ctx.restore();
}

async function drawClan(
  ctx: import('canvas').CanvasRenderingContext2D,
  tag: string,
  logoURL: string,
  x: number,
  y: number,
) {
  if (!tag) return 0;
  const tagFont = 'bold 80px "Noto Sans", Arial, sans-serif';
  ctx.font = tagFont;
  const tagPaddingX = 30,
    tagPaddingY = 15,
    tagHeight = 80,
    logoSize = 60;
  const tagTextWidth = ctx.measureText(tag).width;
  const boxWidth = logoSize + 20 + tagTextWidth + tagPaddingX * 2;
  const boxHeight = tagHeight + tagPaddingY * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 20);
  ctx.fill();
  const logoImg = await loadImageSafe(logoURL);
  if (logoImg)
    ctx.drawImage(
      logoImg as unknown as any,
      x + tagPaddingX,
      y + (boxHeight - logoSize) / 2 + 4,
      logoSize,
      logoSize,
    );
  ctx.fillStyle = '#fff';
  ctx.font = tagFont;
  ctx.fillText(
    tag,
    x + tagPaddingX + logoSize + 20,
    y + boxHeight / 2 + tagHeight / 2 - 10,
  );
  return boxWidth + 50;
}

export const contextCommand: ContextCommand<MessageContextMenuCommandInteraction> =
  {
    data: new ContextMenuCommandBuilder()
      .setName('Screen Message')
      .setType(ApplicationCommandType.Message),

    async execute(
      selfbotUser: SelfbotUser,
      interaction: MessageContextMenuCommandInteraction,
    ) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const message = interaction.targetMessage;
      const author = selfbotUser.users.cache.get(message.author.id);

      const lines = message.content.split('\n');
      const lineHeight = 120,
        baseHeight = 350,
        canvasHeight = baseHeight + lines.length * lineHeight;
      const canvas = createCanvas(3000, canvasHeight * 1.3);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#2f3136';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar
      const avatarImg = await loadImageSafe(
        author?.displayAvatarURL({ format: 'png' }),
      );
      drawAvatar(ctx, avatarImg, 150, 150, 300);

      // Author name
      const pseudoX = 500,
        pseudoY = 250;
      ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#fff';
      const authorName = message.author.displayName || message.author.username;
      ctx.fillText(authorName, pseudoX, pseudoY);
      let currentX = pseudoX + ctx.measureText(authorName).width + 60;

      // Clan
      const clanTag = author?.clan?.tag?.replace(/\[|\]/g, '') || '';
      const clanLogoURL = author?.clanBadgeURL?.() || '';
      if (clanTag)
        currentX += await drawClan(
          ctx,
          clanTag,
          clanLogoURL,
          currentX,
          pseudoY - 80,
        );

      // Timestamp
      ctx.font = '80px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#72767d';
      ctx.fillText(
        formatDate(new Date(message.createdTimestamp)),
        currentX,
        pseudoY,
      );

      // Message content
      ctx.font = '100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#dcddde';
      lines.forEach((line, i) => ctx.fillText(line, 500, 390 + i * lineHeight));

      const buffer = canvas.toBuffer('image/png');
      await interaction.editReply({
        files: [{ attachment: buffer, name: 'screen.png' }],
      });
    },
  };
