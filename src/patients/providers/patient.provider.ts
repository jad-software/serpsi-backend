import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { Patient } from '../entities/patient.entity';

export const patientProvider = [
  {
    provide: data_providers.PATIENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Patient),
    inject: [data_providers.DATA_SOURCE],
  },
];
