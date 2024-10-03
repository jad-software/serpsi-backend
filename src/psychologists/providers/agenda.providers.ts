import { data_providers } from 'src/constants';
import { DataSource } from 'typeorm';
import { Agenda } from '../entities/agenda.entity';

export const agendaProvider = [
  {
    provide: data_providers.AGENDA_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Agenda),
    inject: [data_providers.DATA_SOURCE],
  },
];
