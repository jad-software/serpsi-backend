import { DataSource } from 'typeorm';
import { data_providers } from '../../constants';
import { Document } from '../entities/document.entity';

export const documentProvider = [
  {
    provide: data_providers.DOCUMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Document),
    inject: [data_providers.DATA_SOURCE],
  },
];
