import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  time,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('token')
    .setDescription('Allows you to see your discord token')
    .setDescriptionLocalization('fr', 'Permet de voir votre token discord'),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const user = await interaction.client.users.cache
      .get(selfbotUser.user!.id)
      ?.fetch();

    const embed = new EmbedBuilder()
      .setColor('NotQuiteBlack')
      .setDescription(
        selfbotUser.lang === 'fr'
          ? `-# > Nous vous deconseillons grandement de partager votre token Discord avec d'autres utilisateurs, des assaillant pourrai s'en servir pour pirater votre compte Discord.\n\n**VOTRE TOKEN:** \n-# \`\`\`${selfbotUser.token}\`\`\`\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 31, 'R')}*`
          : `-# > We strongly advise you not to share your Discord token with other users. Attackers could use it to hack your Discord account.\n\n**YOUR TOKEN:** \n-# \`\`\`${selfbotUser.token}\`\`\`\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 31, 'R')}*`,
      );

    const pvMessage = await user?.send({ embeds: [embed] }).catch(async () => {
      await interaction.editReply({
        content:
          selfbotUser.lang === 'fr'
            ? `Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!`
            : `You must enable your private messages to use this feature!`,
      });
    });

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setURL(`${pvMessage?.url}`)
        .setLabel(
          selfbotUser.lang === 'fr'
            ? 'Votre token discord'
            : 'Your discord token',
        )
        .setStyle(ButtonStyle.Link),
    );

    if (pvMessage) {
      await interaction.editReply({ components: [button] });
      setTimeout(async () => {
        await pvMessage.delete().catch(() => null);
      }, 30000);
    }
  },
};
