import { data_providers } from 'src/constants';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { DataSource } from 'typeorm';


export const meetingsProvider = [
  {
    provide: data_providers.MEETINGS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Meeting),
    inject: [data_providers.DATA_SOURCE],
  },
];
