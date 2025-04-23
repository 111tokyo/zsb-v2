import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import config from '../../src/config';

const client = createClient({ url: config.dbFilePath });
const db = drizzle({ client });

export default db;
