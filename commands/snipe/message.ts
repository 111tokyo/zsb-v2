import { createCanvas, Image, loadImage } from 'canvas';
import { time } from 'discord.js';
import { TextChannel } from 'discord.js-selfbot-v13';
import { MessageCommand } from '../../src/types/interactions';

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

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const snipeMap = selfbotUser.snipe.get(message.channelId);

    // Helper for error messages
    const editMsg = (content: string) => message.edit({ content });

    // --- Snipe 1 message ---
    if (!args[0]) {
      const snipedMessage = snipeMap?.[0] || null;
      if (!snipedMessage)
        return void editMsg(
          selfbotUser.lang === 'fr'
            ? `**Aucun message n'a été supprimé dans ce salon.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**No messages have been deleted in this channel.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
        );

      const lines = snipedMessage.content.split('\n');
      const lineHeight = 120,
        baseHeight = 350,
        canvasHeight = baseHeight + lines.length * lineHeight;
      const canvas = createCanvas(3000, canvasHeight * 1.3);
      const ctx = canvas.getContext(
        '2d',
      ) as import('canvas').CanvasRenderingContext2D;

      ctx.fillStyle = '#2f3136';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar
      const avatarImg = await loadImageSafe(
        snipedMessage.avatarURL ?? undefined,
      );
      drawAvatar(ctx, avatarImg, 150, 150, 300);

      // Author name
      const pseudoX = 500,
        pseudoY = 250;
      ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#fff';
      const authorName =
        snipedMessage.author.displayName || snipedMessage.author.username;
      ctx.fillText(authorName, pseudoX, pseudoY);
      let currentX = pseudoX + ctx.measureText(authorName).width + 60;

      // Clan
      const clanTag =
        snipedMessage.author.clan?.tag?.replace(/\[|\]/g, '') || '';
      const clanLogoURL = snipedMessage.author.clanBadgeURL?.() || '';
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
        formatDate(new Date(snipedMessage.createdTimestamp)),
        currentX,
        pseudoY,
      );

      // Message content
      ctx.font = '100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#dcddde';
      lines.forEach((line, i) => ctx.fillText(line, 500, 390 + i * lineHeight));

      const buffer = canvas.toBuffer('image/png');
      await message.delete();
      const channel = (await selfbotUser.channels.cache
        .get(message.channelId)
        ?.fetch()) as TextChannel;
      await channel.send({
        files: [{ attachment: buffer, name: 'snipe.png' }],
      });
      return;
    }

    // --- Snipe multiple messages ---
    const numberOfMessages = parseInt(args[0]);
    if (isNaN(numberOfMessages))
      return void editMsg(
        selfbotUser.lang === 'fr'
          ? `**Le nombre de messages à sniper doit être un chiffre! (*Exemple*: \`${selfbotUser.prefix}snipe 5\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**The number of messages to snipe must be a digit! (*Example*: \`${selfbotUser.prefix}snipe 5\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );
    if (numberOfMessages > 10)
      return void editMsg(
        selfbotUser.lang === 'fr'
          ? `**Tu ne peux pas sniper plus de 10 messages à la fois!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You can't snipe more than 10 messages at once!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );

    const snipedMessages = snipeMap?.slice(0, numberOfMessages) || [];
    if (!snipedMessages.length)
      return void editMsg(
        selfbotUser.lang === 'fr'
          ? `**Aucun message n'a été supprimé dans ce salon.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**No messages have been deleted in this channel.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );

    // Preload avatars and clan logos to minimize await in loop
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
    await message.delete();
    const channel = (await selfbotUser.channels.cache
      .get(message.channelId)
      ?.fetch()) as TextChannel;
    await channel.send({ files: [{ attachment: buffer, name: 'snipe.png' }] });
  },
};
