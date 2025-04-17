import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import config from '../config';

export default defineConfig({
  out: '../src/db',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: config.dbFilePath,
  },
});
