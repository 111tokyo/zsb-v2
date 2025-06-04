import {
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
  } from 'discord.js';
  import { VoiceBasedChannel } from 'discord.js-selfbot-v13';
  import { SlashCommand } from '../../src/types/interactions';
import SelfbotUser from '../../src/classes/SelfbotUser';
  
  export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName('ddos')
      .setDescription('Allows you to ddos a voice channel.')
      .setDescriptionLocalization('fr', 'Permet de ddoser un salon vocal.')
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('The channel that you want to ddos.')
          .setDescriptionLocalization(
            'fr',
            'Le salon que vous souhaitez ddoser.',
          )
          .addChannelTypes(ChannelType.GuildVoice)
          .setRequired(true),
      )
      .addIntegerOption(option =>
        option
          .setName('time')
          .setDescription('The time that you want to ddos.')
          .setDescriptionLocalization(
            'fr',
            'Le temps que vous souhaitez ddoser.',
          )
          .setMinValue(1)
          .setMaxValue(30)
          .setRequired(true),
      ),
    execute: async (
      selfbotUser: SelfbotUser,
      interaction: ChatInputCommandInteraction,
    ) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const channelId = interaction.options.getChannel('channel')?.id;
        const time = interaction.options.getInteger('time')! * 1000;
        const channel = (await selfbotUser.channels.cache
            .get(channelId!)
            ?.fetch()
            ?.catch(async () => {
                await interaction.editReply({
                content:
                  selfbotUser.lang === "fr"
                    ? `Vous ne possédez pas les permissions nécessaires pour voir le channel !`
                    : `You do not have the necessary permissions to see the channel !`,
              });
            })) as VoiceBasedChannel

          const originalRegion = channel.rtcRegion;
      
          const regions = [
            "brazil",
            "hongkong",
            "india",
            "japan",
            "rotterdam",
            "russia",
            "singapore",
            "south-korea",
            "southafrica",
            "sydney",
            "us-central",
            "us-east",
            "us-south",
            "us-west",
          ];
           if(!channel.manageable) {
            await interaction.editReply({
              content:
                selfbotUser.lang === "fr"
                  ? `Vous ne possédez pas les permissions nécessaires pour DDOS un salon vocal !`
                  : `You do not have the necessary permissions to DDOS a voice channel!`,
            });
            return;
          }
      
      
         await interaction.editReply({
            content:
              selfbotUser.lang === "fr"
                ? `Vous etes en train de DDOS le salon vocal ${channel}...`
                : `You are currently DDOSing the voice channel ${channel}...`,
          });
      
          for (let i = 0; i < time; i++) {
            try {
              const newRandom = Math.floor(Math.random() * regions.length);
              await channel.setRTCRegion(regions[newRandom]);
            } catch {}
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
      
          await channel.setRTCRegion(originalRegion);
      
          await interaction.editReply({
            content:
              selfbotUser.lang === "fr"
                ? `Vous avez DDOS le salon vocal ${channel} avec succès !`
                : `You successfully DDOSed the voice channel ${channel}!`,
          });
    },
  };
  