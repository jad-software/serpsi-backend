import { DataSource } from 'typeorm';
import { POSTGRES_URL, TEST_POSTGRES_URL } from './constants';

export const postgresDataSource = new DataSource({
  type: 'postgres',
  url: POSTGRES_URL,
  migrations: ['./dist/database/migrations/*.{ts,js}'],
  entities: ['./dist/**/entities/*.{ts,js}'],
  logging: true,
});

export const testDataSource = new DataSource({
  type: 'postgres',
  url: TEST_POSTGRES_URL,
  migrations: ['./dist/database/migrations/*.{ts,js}'],
  entities: ['./src/**/entities/*.{ts,js}'],
  logging: false,
});
