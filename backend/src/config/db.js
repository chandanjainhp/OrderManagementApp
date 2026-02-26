import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import 'dotenv/config';

export const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

export async function connectDB() {
    await client.connect();
    console.log('Connected to PostgreSQL');
}

export const db = drizzle(client);
