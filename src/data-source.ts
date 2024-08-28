
import { DataSource } from 'typeorm';
require('dotenv').config();

export const postgresDataSource = new DataSource({
    type: "postgres",
    url: process.env.POSTGRES_URL,
    migrations: ["./dist/database/migrations/*.{ts,js}"],
    entities: ["./dist/**/entities/*.{ts,js}"],
    logging: false,
});