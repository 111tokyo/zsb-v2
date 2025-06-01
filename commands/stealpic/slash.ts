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
      const targetAvatar = await selfbotUser.users.fetch(user.id);
      const isGif = targetAvatar.avatarURL({ dynamic: true })?.endsWith('.gif');
      const ok = isGif && selfbotUser.user?.premiumType !== 2
      if (ok) {
        await selfbotUser.user?.setAvatar(targetAvatar.avatarURL({ format: 'png' }));
      } else {
        await selfbotUser.user?.setAvatar(targetAvatar.avatarURL({ dynamic: true }));
      }

      await interaction.reply({
        content: selfbotUser.lang === 'fr' ? `J'ai volé l'avatar de ${user}${ok ? ', malheuresement sa photo est un gif donc je l\'ai converti en png.' : '.'}` : `I stole ${user}'s avatar${ok ? ', unfortunately his photo is a gif so I converted it to png.' : '.'}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    },
  };
  