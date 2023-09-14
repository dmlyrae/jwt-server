import { Client } from "pg";
import dotenv from 'dotenv';
dotenv.config();

export const getClient = async () => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '5432'),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
  });
  await client.connect();
  return client;
}