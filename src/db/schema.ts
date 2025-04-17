import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import config from '../config';

export const selfbotUsersTable = sqliteTable('selfbot_users_table', {
  id: text().notNull().unique().primaryKey(),
  token: text().notNull().unique(),
  username: text().notNull().unique(),
  commandType: text()
    .notNull()
    .$default(() => 'Slash'),
  lang: text()
    .notNull(),
  prefix: text()
    .notNull()
    .$default(() => '&'),
  voiceStateOptions: text()
    .notNull()
    .$default(
      () =>
        `{
          "voiceChannelId": null, 
          "selfMute": true, 
          "selfDeaf": true, 
          "selfVideo": false, 
          "selfStream": false
        }`,
    ),
  richPresenceOptions: text()
    .notNull()
    .$default(
      () =>
        `{
          "choice": "default_rpc", 
          "richPresences": [
          {
            "id": "default_rpc",
            "name": "ZSB",
            "field1": "ZSB Selfbot",
            "field2": "Click below to start",
            "type": "Competing", 
            "platform": "Pc",
            "largeImg": null, 
            "smallImg": null,
            "button1": { "label": "➜ Get started", "url": "${config.supportServerInvite}"},
            "button2": null
          }
        ]
      }`,
    ),
});
