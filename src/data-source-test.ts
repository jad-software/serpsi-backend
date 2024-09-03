import { DataSource } from 'typeorm';
import { TEST_POSTGRES_URL } from './constants';


export const testDataSource = new DataSource({
  type: 'postgres',
  url: TEST_POSTGRES_URL,
  migrations: ['./dist/database/migrations/*.{ts,js}'],
  entities: ['./src/**/entities/*.{ts,js}'],
  logging: false,
});
