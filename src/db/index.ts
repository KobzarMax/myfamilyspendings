import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";

import { config } from 'dotenv';


config({ path: '.env.development' });

const client = postgres(process.env.VITE_SUPABASE_DB_URL!);

const database = drizzle(client, { schema });

export default database;
