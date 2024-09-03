import { TEST_INTEGRATION, data_providers } from '../constants';
import { postgresDataSource } from '../data-source';
import { testDataSource } from '../data-source-test';

export const databaseProviders = [
  {
    provide: data_providers.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = TEST_INTEGRATION ? testDataSource : postgresDataSource;
      await dataSource.initialize();
      console.log('Database connected successfully');
      return dataSource;
    },
  },
];
