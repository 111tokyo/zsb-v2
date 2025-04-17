import { eq } from 'drizzle-orm';
import db from './index';
import { selfbotUsersTable } from './schema';

export async function getUserById(userId: string) {
  return db
    .select()
    .from(selfbotUsersTable)
    .where(eq(selfbotUsersTable.id, userId))
    .get();
}

export async function getSpecificUserData(userId: string) {
  return db
    .select({
      voiceStateOptions: selfbotUsersTable.voiceStateOptions,
      richPresenceOptions: selfbotUsersTable.richPresenceOptions,
      commandType: selfbotUsersTable.commandType,
      lang: selfbotUsersTable.lang,
      prefix: selfbotUsersTable.prefix,
    })
    .from(selfbotUsersTable)
    .where(eq(selfbotUsersTable.id, userId))
    .get();
}

export async function getUserToken(userId: string) {
  return db
    .select({ token: selfbotUsersTable.token })
    .from(selfbotUsersTable)
    .where(eq(selfbotUsersTable.id, userId))
    .get();
}

export async function getAllUsersToken() {
  return db
    .select({ token: selfbotUsersTable.token })
    .from(selfbotUsersTable)
    .all();
}
