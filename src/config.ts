import 'dotenv/config';

const config = {
  serverAddress: process.env.SERVER_ADDRESS!,
  clientToken: process.env.DISCORD_CLIENT_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID || '',
  webhookURL: process.env.WEBHOOK_URL || '',
  dbFilePath: process.env.DB_FILE_PATH || '',
  sbVersion: '0.1.2@BETA',
  supportServerInvite: 'https://discord.gg/zsb',
  APIs: {
    aiKey: process.env.API_AI_TOKEN || '',
  },
};

export default config;
