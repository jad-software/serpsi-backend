import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { Psychologist } from '../entities/psychologist.entity';

export const psychologistProvider = [
  {
    provide: data_providers.PSYCHOLOGISTS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Psychologist),
    inject: [data_providers.DATA_SOURCE],
  },
];
