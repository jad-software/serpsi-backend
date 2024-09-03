import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { Medicine } from '../entities/medicine.entity';

export const medicineProvider = [
  {
    provide: data_providers.MEDICINE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Medicine),
    inject: [data_providers.DATA_SOURCE],
  },
];
