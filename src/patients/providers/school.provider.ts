import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { School } from '../entities/school.entity';

export const schoolProvider = [
  {
    provide: data_providers.SCHOOL_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(School),
    inject: [data_providers.DATA_SOURCE],
  },
];
