import 'dotenv/config';

const config = {
  serverAddress: process.env.SERVER_ADDRESS!,
  clientToken: process.env.DISCORD_CLIENT_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID || '',
  webhookURL: process.env.WEBHOOK_URL || '',
  dbFilePath: process.env.DB_FILE_PATH || '',
  version: 'BETA v0.9.2',
  supportServerInvite: 'https://discord.gg/tvXJ4HVYdN',
  supportServerId: '1370002137299554385',
  voiceChannelIds: [
    '1371233192190935152',
    '1371233234767319270',
    '1371233248448872559',
  ],
  api: {
    port: 3000,
  },
  libs: {
    aiKey: process.env.API_AI_KEY || '',
    prevnameKey: process.env.API_PREVNAME_TOKEN || '',
  },
};

export default config;
