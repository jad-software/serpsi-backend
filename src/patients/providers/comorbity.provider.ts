import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { Comorbidity } from '../entities/comorbidity.entity';

export const comorbidityProvider = [
  {
    provide: data_providers.COMORBIDITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Comorbidity),
    inject: [data_providers.DATA_SOURCE],
  },
];
