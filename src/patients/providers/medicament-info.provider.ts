import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { MedicamentInfo } from '../entities/medicament-info.entity';

export const medicamentInfoProvider = [
  {
    provide: data_providers.MEDICAMENTINFO_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MedicamentInfo),
    inject: [data_providers.DATA_SOURCE],
  },
];
