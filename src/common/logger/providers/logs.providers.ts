import { data_providers } from '../../../constants';
import { DataSource } from 'typeorm';
import { LogEntity } from '../entities/logger.entity';


export const logsProvider = [
  {
    provide: data_providers.LOGS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LogEntity),
    inject: [data_providers.DATA_SOURCE],
  },
];
