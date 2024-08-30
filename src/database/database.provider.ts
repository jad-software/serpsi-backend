import { data_providers } from 'src/constants';
import { postgresDataSource } from 'src/data-source';

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
