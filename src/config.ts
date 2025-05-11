import 'dotenv/config';

const config = {
  serverAddress: process.env.SERVER_ADDRESS!,
  clientToken: process.env.DISCORD_CLIENT_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID || '',
  webhookURL: process.env.WEBHOOK_URL || '',
  dbFilePath: process.env.DB_FILE_PATH || '',
  sbVersion: '0.9.8',
  supportServerInvite: 'https://discord.gg/user.exe',
  supportServerId: '943628184124018708',
  voiceChannelIds: [
    '1369747856046559283',
    '1369747924543868938',
    '1369747981120569465',
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
