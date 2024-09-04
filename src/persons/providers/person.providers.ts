import { DataSource } from 'typeorm';
import { Person } from '../entities/person.enitiy';
import { data_providers } from 'src/constants';

export const personProvider = [
  {
    provide: data_providers.PERSON_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Person),
    inject: [data_providers.DATA_SOURCE],
  },
];
