
import { DataSource } from 'typeorm';
import { POSTGRES_URL } from './constants';


export const postgresDataSource = new DataSource({
    type: "postgres",
    url: POSTGRES_URL,
    migrations: ["./dist/database/migrations/*.{ts,js}"],
    entities: ["./dist/**/entities/*.{ts,js}"],
    logging: true,
});