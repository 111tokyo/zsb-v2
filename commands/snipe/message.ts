import { createCanvas, loadImage } from 'canvas';
import { time } from 'discord.js';
import { TextChannel } from 'discord.js-selfbot-v13';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
  async execute(_selfbot, selfbotUser, message, args: string[]) {
    const now = Math.floor(Date.now() / 1000);
    if (!args[0]) {
      const snipedMessage = selfbotUser.snipe.get(message.channelId)
        ? selfbotUser.snipe.get(message.channelId)![0]
        : null;

      if (!snipedMessage) {
        await message.edit({
          content:
            selfbotUser.lang === 'fr'
              ? `**Aucun message n'a été supprimé dans ce salon.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
              : `**No messages have been deleted in this channel.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
        });
        return;
      }

      const lines = snipedMessage.content.split('\n');
      const lineHeight = 120; // **Augmente l'espace entre les lignes**
      const baseHeight = 350;
      const canvasHeight = baseHeight + lines.length * lineHeight;

      const canvas = createCanvas(3000, canvasHeight * 1.3);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#2f3136';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar
      let avatarURL = snipedMessage.avatarURL || null;
      let avatarImage: any = null;

      if (avatarURL) {
        try {
          avatarImage = await loadImage(avatarURL);
        } catch (err) {
          avatarImage = null;
        }
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

      // Ajustements
      const pseudoX = 500;
      const pseudoY = 250;

      // Author name
      ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        snipedMessage.author.displayName || snipedMessage.author.username,
        pseudoX,
        pseudoY,
      );

      let currentX =
        pseudoX +
        ctx.measureText(
          snipedMessage.author.displayName || snipedMessage.author.username,
        ).width +
        60;

      // Clan tag and logo
      const clanTag =
        snipedMessage.author.clan?.tag?.replace('[', '').replace(']', '') || '';
      const clanLogoURL = snipedMessage.author.clanBadgeURL?.() || '';
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

        const tagY = pseudoY - boxHeight / 2 - 30;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(currentX, tagY, boxWidth, boxHeight, 20);
        ctx.fill();

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

        ctx.fillStyle = '#ffffff';
        ctx.font = tagFont;
        const logoOffsetX = currentX + tagPaddingX + logoSize + 20;
        ctx.fillText(clanTag, logoOffsetX, pseudoY);

        currentX += boxWidth + 50;
      }

      // Timestamp
      const createdAt = new Date(snipedMessage.createdTimestamp);
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

      await message.delete();

      const channel = (await selfbotUser.channels.cache
        .get(message.channelId)
        ?.fetch()) as TextChannel;

      await channel.send({
        files: [{ attachment: buffer, name: 'snipe.png' }],
      });

      return;
    }

    const numberOfMessages = parseInt(args[0]);
    if (isNaN(numberOfMessages)) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Le nombre de messages à sniper doit être un chiffre! (*Exemple*: \`${selfbotUser.prefix}snipe 5\`)**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
            : `**The number of messages to snipe must be a digit! (*Example*: \`${selfbotUser.prefix}snipe 5\`)**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      });
      return;
    }

    if (numberOfMessages > 10) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Tu ne peux pas sniper plus de 10 messages à la fois!**`
            : `**You can't snipe more than 10 messages at once!**`,
      });
      return;
    }

    const snipedMessages =
      selfbotUser.snipe.get(message.channelId)?.slice(0, numberOfMessages) ||
      [];

    if (snipedMessages.length === 0) {
      await message.edit({
        content:
          selfbotUser.lang === 'fr'
            ? `**Aucun message n'a été supprimé dans ce salon.**`
            : `**No messages have been deleted in this channel.**`,
      });
      return;
    }

    // --- Canvas setup ---
    const lineHeight = 120;
    const userHeaderHeight = 350;
    const baseHeight = 200;
    const canvasHeight =
      baseHeight +
      snipedMessages.reduce((total, msg, index, arr) => {
        if (index === 0)
          return (
            total +
            userHeaderHeight +
            msg.content.split('\n').length * lineHeight
          );
        if (msg.author.id === arr[index - 1].author.id) {
          return total + msg.content.split('\n').length * lineHeight + 100; // même auteur ➔ juste espacement
        } else {
          return (
            total +
            userHeaderHeight +
            msg.content.split('\n').length * lineHeight
          );
        }
      }, 0);

    const canvas = createCanvas(3000, canvasHeight * 1.3);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#2f3136';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = 150;
    let previousAuthorId = '';

    for (const snipedMessage of snipedMessages) {
      const isSameAuthor = snipedMessage.author.id === previousAuthorId;

      if (!isSameAuthor) {
        // Draw avatar
        const avatarURL = snipedMessage.avatarURL || null;
        let avatarImage: any = null;

        if (avatarURL) {
          try {
            avatarImage = await loadImage(avatarURL);
          } catch (err) {
            avatarImage = null;
          }
        }

        if (avatarImage) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(300, y + 150, 150, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(avatarImage, 150, y, 300, 300);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(300, y + 150, 150, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fillStyle = '#72767d';
          ctx.fill();
          ctx.restore();
        }

        const pseudoX = 500;
        const pseudoY = y + 100;

        // Author name
        ctx.font = 'bold 100px "Noto Sans", Arial, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(
          snipedMessage.author.displayName || snipedMessage.author.username,
          pseudoX,
          pseudoY,
        );

        let currentX =
          pseudoX +
          ctx.measureText(
            snipedMessage.author.displayName || snipedMessage.author.username,
          ).width +
          60;

        // Clan tag and logo
        const clanTag =
          snipedMessage.author.clan?.tag?.replace('[', '').replace(']', '') ||
          '';
        const clanLogoURL = snipedMessage.author.clanBadgeURL?.() || '';
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

          const tagY = pseudoY - boxHeight / 2 - 30;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.roundRect(currentX, tagY, boxWidth, boxHeight, 20);
          ctx.fill();

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

          ctx.fillStyle = '#ffffff';
          ctx.font = tagFont;
          const logoOffsetX = currentX + tagPaddingX + logoSize + 20;
          ctx.fillText(clanTag, logoOffsetX, pseudoY);

          currentX += boxWidth + 50;
        }

        // Timestamp
        const createdAt = new Date(snipedMessage.createdTimestamp);
        const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1).toString().padStart(2, '0')}/${createdAt.getFullYear()} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

        ctx.font = '80px "Noto Sans", Arial, sans-serif';
        ctx.fillStyle = '#72767d';
        ctx.fillText(formattedDate, currentX, pseudoY);

        y += 250; // Espace après pseudo
      } else {
        y += 100; // Saut simple entre 2 messages du même auteur
      }

      // Message content
      ctx.font = '100px "Noto Sans", Arial, sans-serif';
      ctx.fillStyle = '#dcddde';

      const lines = snipedMessage.content.split('\n');
      for (const line of lines) {
        ctx.fillText(line, 500, y);
        y += lineHeight;
      }

      previousAuthorId = snipedMessage.author.id;
    }

    const buffer = canvas.toBuffer('image/png');

    await message.delete();

    const channel = (await selfbotUser.channels.cache
      .get(message.channelId)
      ?.fetch()) as TextChannel;

    await channel.send({
      files: [{ attachment: buffer, name: 'snipe.png' }],
    });
  },
};
