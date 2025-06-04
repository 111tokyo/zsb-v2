import { createCanvas, Image, loadImage } from 'canvas';
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { TextChannel } from 'discord.js-selfbot-v13';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

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

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription(
      'Allows you to see the last deleted message(s) of a channel.',
    )
    .setDescriptionLocalization(
      'fr',
      "Permet de voir les derniers messages supprimés d'un salon.",
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription(
          'The number of deleted messages you want to snipe. (max: 10)',
        )
        .setDescriptionLocalization(
          'fr',
          'Le nombre de messages supprimés que vous souhaitez sniper. (max: 10)',
        )
        .setMaxValue(10)
        .setMinValue(2)
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const amount = interaction.options.getInteger('amount') ?? 1;

    const snipedMessages =
      selfbotUser.snipe.get(interaction.channelId)?.slice(0, amount) || [];

    if (snipedMessages.length === 0) {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Aucun message n'a été supprimé dans ce salon.`
            : `No messages have been deleted in this channel.`,
      });
      return;
    }

    // Preload avatars and clan logos
    const avatarCache: Record<string, Image | null> = {};
    const clanLogoCache: Record<string, Image | null> = {};
    await Promise.all(
      snipedMessages.map(async msg => {
        if (!avatarCache[msg.author.id])
          avatarCache[msg.author.id] = await loadImageSafe(
            msg.avatarURL ?? undefined,
          );
        const clanLogoURL = msg.author.clanBadgeURL?.();
        if (clanLogoURL && !clanLogoCache[clanLogoURL])
          clanLogoCache[clanLogoURL] = await loadImageSafe(clanLogoURL);
      }),
    );

    // Canvas height calculation
    const lineHeight = 120,
      userHeaderHeight = 350,
      baseHeight = 200;
    const canvasHeight =
      baseHeight +
      snipedMessages.reduce((total, msg, i, arr) => {
        const lines = msg.content.split('\n').length;
        if (i === 0) return total + userHeaderHeight + lines * lineHeight;
        return (
          total +
          (msg.author.id === arr[i - 1].author.id
            ? lines * lineHeight + 100
            : userHeaderHeight + lines * lineHeight)
        );
      }, 0);

    const canvas = createCanvas(3000, canvasHeight * 1.3);
    const ctx = canvas.getContext(
      '2d',
    ) as import('canvas').CanvasRenderingContext2D;
    ctx.fillStyle = '#2f3136';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = 150,
      previousAuthorId = '';
    for (const msg of snipedMessages) {
      const isSameAuthor = msg.author.id === previousAuthorId;
      if (!isSameAuthor) {
        drawAvatar(ctx, avatarCache[msg.author.id], 150, y, 300);
        const pseudoX = 500,
          pseudoY = y + 100;
        ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
        ctx.fillStyle = '#fff';
        const authorName = msg.author.displayName || msg.author.username;
        ctx.fillText(authorName, pseudoX, pseudoY);
        let currentX = pseudoX + ctx.measureText(authorName).width + 60;
        const clanTag = msg.author.clan?.tag?.replace(/\[|\]/g, '') || '';
        const clanLogoURL = msg.author.clanBadgeURL?.() || '';
        if (clanTag)
          currentX += await (async () => {
            ctx.save();
            const width = await drawClan(
              ctx,
              clanTag,
              clanLogoURL,
              currentX,
              pseudoY - 80,
            );
            ctx.restore();
            return width;
          })();
        ctx.font = '80px "Noto Sans", Arial, sans-serif';
        ctx.fillStyle = '#72767d';
        ctx.fillText(
          formatDate(new Date(msg.createdTimestamp)),
          currentX,
          pseudoY,
        );
        y += 250;
      } else {
        y += 100;
      }
      ctx.font = '100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#dcddde';
      for (const line of msg.content.split('\n')) {
        ctx.fillText(line, 500, y);
        y += lineHeight;
      }
      previousAuthorId = msg.author.id;
    }

    const buffer = canvas.toBuffer('image/png');
    const channel = (await selfbotUser.channels.cache
      .get(interaction.channelId)
      ?.fetch()) as TextChannel;

    await channel.send({
      files: [{ attachment: buffer, name: 'snipe.png' }],
    });

    await interaction.deleteReply();
  },
};
