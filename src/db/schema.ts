import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import config from '../config';

export const selfbotUsersTable = sqliteTable('selfbot_users_table', {
  id: text().notNull().unique().primaryKey(),
  token: text().notNull().unique(),
  username: text().notNull().unique(),
  lang: text().notNull(),
  commandType: text()
    .notNull()
    .$default(() => 'Both'),
  prefix: text()
    .notNull()
    .$default(() => '&'),
  voiceOptions: text()
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
  statusOptions: text()
    .notNull()
    .$default(
      () =>
        `{
          "choice": "default_status", 
          "richPresences": [
          {
            "id": "default_status",
            "name": "Selfbot.exe",
            "field1": "User.exe",
            "field2": "Click below to join",
            "field3": null,
            "type": "Competing", 
            "platform": "Pc",
            "largeImg": null, 
            "smallImg": null,
            "button1": { "label": "➜ Join User.exe", "url": "${config.supportServerInvite}"},
            "button2": null
          }
        ]
      }`,
    ),
});
