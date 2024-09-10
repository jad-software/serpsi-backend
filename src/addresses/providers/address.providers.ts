import { DataSource } from 'typeorm';
import { data_providers } from 'src/constants';
import { Address } from '../entities/address.entity';

export const addressProvider = [
  {
    provide: data_providers.ADDRESS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
    inject: [data_providers.DATA_SOURCE],
  },
];
