import { data_providers } from '../../constants';
import { DataSource } from 'typeorm';
import { Unusual } from '../entities/unusual.entity';

export const unusualProvider = [
  {
    provide: data_providers.UNUSUAL_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Unusual),
    inject: [data_providers.DATA_SOURCE],
  },
];
