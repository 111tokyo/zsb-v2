import { eq } from 'drizzle-orm';
import { CommandType, LangType } from '../types/interactions';
import db from './index';
import { selfbotUsersTable } from './schema';

export async function insertNewUser(userData: {
  id: string;
  token: string;
  username: string;
  lang: string;
}) {
  return db
    .insert(selfbotUsersTable)
    .values({
      id: userData.id,
      token: userData.token,
      username: userData.username,
      lang: userData.lang
    })
    .execute();
}

export async function updateUserToken(userId: string, newToken: string) {
  return db
    .update(selfbotUsersTable)
    .set({ token: newToken })
    .where(eq(selfbotUsersTable.id, userId))
    .execute();
}

export async function updateUserCommandType(
  userId: string,
  commandType: CommandType,
) {
  return db
    .update(selfbotUsersTable)
    .set({ commandType: commandType })
    .where(eq(selfbotUsersTable.id, userId))
    .execute();
}

export async function updateUserPrefix(userId: string, prefix: string) {
  return db
    .update(selfbotUsersTable)
    .set({ prefix: prefix })
    .where(eq(selfbotUsersTable.id, userId))
    .execute();
}

export async function updateUserLang(userId: string, lang: LangType) {
  return db
    .update(selfbotUsersTable)
    .set({ lang: lang })
    .where(eq(selfbotUsersTable.id, userId))
    .execute();
}

export async function deleteUserByToken(token: string) {
  return db
    .delete(selfbotUsersTable)
    .where(eq(selfbotUsersTable.token, token))
    .execute();
}

export async function deleteUserById(userId: string) {
  return db
    .delete(selfbotUsersTable)
    .where(eq(selfbotUsersTable.id, userId))
    .execute();
}
