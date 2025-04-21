import { REST, Routes } from 'discord.js';
import config from '../config';

const rest = new REST({ version: '10' }).setToken(config.clientToken);

export const sendJSONEmbed = async (channelId: string, components: Object) => {
  try {
    await rest.post(Routes.channelMessages(channelId), {
      body: {
        components: components,
        flags: 1 << 15,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
  }
};
