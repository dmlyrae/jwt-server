import dotenv from 'dotenv';
dotenv.config();
import { DataSource } from "typeorm"
import { User } from "../entities/user";
import { Token } from '../entities/token';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [User, Token]
})
