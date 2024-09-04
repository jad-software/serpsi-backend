import { TEST_INTEGRATION, data_providers } from '../constants';
import { postgresDataSource } from '../data-source';

export const databaseProviders = [
  {
    provide: data_providers.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = postgresDataSource;
      await dataSource.initialize();
      console.log('Database connected successfully');
      return dataSource;
    },
  },
];
