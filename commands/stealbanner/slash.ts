import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
  } from 'discord.js';
  import SelfbotUser from '../../src/classes/SelfbotUser';
  import { SlashCommand } from '../../src/types/interactions';
  
  export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName('stealbanner')
      .setDescription('Allows you to steal a user\'s banner.')
      .setDescriptionLocalization(
        'fr',
        "Permet de voler la banniere d'un utilisateur.",
      )
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to steal the banner from.')
          .setDescriptionLocalization('fr', "L'utilisateur à voler la banniere.")
          .setRequired(true),
      ),
  
    execute: async (
      selfbotUser: SelfbotUser,
      interaction: ChatInputCommandInteraction,
    ) => {
      if (selfbotUser.user?.premiumType !== 2) {
        await interaction.reply({
          content: selfbotUser.lang === 'fr' ? `Vous devez avoir le nitro pour voler la banniere!` : `You must have nitro to steal the banner!`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      const user = interaction.options.getUser('user')!;
      const targetBanner = await selfbotUser.users.fetch(user.id);
     
       if (!targetBanner.bannerURL({ dynamic: true })) {
        await interaction.reply({
          content: selfbotUser.lang === 'fr' ? `Cet utilisateur n'a pas de banniere!` : `This user doesn't have a banner!`,
          flags: MessageFlags.Ephemeral,
        });
        return;
       }

      await selfbotUser.user?.setBanner(targetBanner.bannerURL({ dynamic: true })).catch(async () => {
        await interaction.reply({
          content: selfbotUser.lang === 'fr' 
            ? `Vous devez attendre avant de pouvoir changer de banniere à nouveau.`
            : `You need to wait before changing your banner again.`,
            flags: MessageFlags.Ephemeral,
        });
        return;
      });
      
      await interaction.reply({
        content: selfbotUser.lang === 'fr' ? `J'ai volé la banniere de ${user}` : `I stole ${user}'s banner`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    },
  };
  