import * as dotenv from "dotenv";
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: `.env.development`,
});

export default defineConfig({
  schema: './src/db/drizzle/schema.ts',
  out: './src/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    database: "postgres",
    port: 5432,
    host: "aws-1-eu-west-1.pooler.supabase.com",
    user: process.env.VITE_SUPABASE_DB_USER,
    password: process.env.VITE_SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  },
  schemaFilter: ["public"],
  introspect: {
    casing: "preserve",
  },
  casing: "snake_case",
});
