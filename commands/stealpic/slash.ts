import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
  } from 'discord.js';
  import SelfbotUser from '../../src/classes/SelfbotUser';
  import { SlashCommand } from '../../src/types/interactions';
  
  export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName('stealpic')
      .setDescription('Allows you to steal a user\'s avatar.')
      .setDescriptionLocalization(
        'fr',
        "Permet de voler l'avatar d'un utilisateur.",
      )
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to steal the avatar from.')
          .setDescriptionLocalization('fr', "L'utilisateur à voler l'avatar.")
          .setRequired(true),
      ),
  
    execute: async (
      selfbotUser: SelfbotUser,
      interaction: ChatInputCommandInteraction,
    ) => {
      const user = interaction.options.getUser('user')!;
      const targetAvatar = await selfbotUser.users.cache.get(user.id)!.fetch();
      const isGif = targetAvatar.avatarURL({ dynamic: true })?.endsWith('.gif');
      const ok = isGif && selfbotUser.user?.premiumType !== 2
      if (ok) {
        await selfbotUser.user?.setAvatar(targetAvatar.avatarURL({ format: 'png' })).catch(async () => {
          await interaction.reply({
            content: selfbotUser.lang === 'fr' ? `Vous devez attendre avant de pouvoir changer d'avatar à nouveau.` : `You need to wait before changing your avatar again.`,
            flags: MessageFlags.Ephemeral,
          })
          return;
        })
      } else {
        await selfbotUser.user?.setAvatar(targetAvatar.avatarURL({ dynamic: true })).catch(async () => {
          await interaction.reply({
            content: selfbotUser.lang === 'fr' ? `Vous devez attendre avant de pouvoir changer d'avatar à nouveau.` : `You need to wait before changing your avatar again.`,
            flags: MessageFlags.Ephemeral,
          })
          return;
        });
      }

      await interaction.reply({
        content: selfbotUser.lang === 'fr' ? `Vous avez volé l'avatar de ${user}${ok ? ', malheuresement sa photo est un gif donc je l\'ai converti en png.' : '.'}` : `You stole ${user}'s avatar${ok ? ', unfortunately his photo is a gif so I converted it to png.' : '.'}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    },
  };
  