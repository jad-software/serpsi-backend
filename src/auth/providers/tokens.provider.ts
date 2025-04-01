import { data_providers } from '../../constants';
import { DataSource } from 'typeorm';
import { Token } from '../entities/tokens.entity';

export const tokenProvider = [
  {
    provide: data_providers.TOKENS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
    inject: [data_providers.DATA_SOURCE],
  },
];
