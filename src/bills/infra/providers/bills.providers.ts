import { Bill } from '../../domain/entities/bill.entity';
import { data_providers } from '../../../constants';
import { DataSource } from 'typeorm';


export const billsProvider = [
  {
    provide: data_providers.BILLS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Bill),
    inject: [data_providers.DATA_SOURCE],
  },
];
