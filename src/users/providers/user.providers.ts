import { DataSource } from "typeorm";
import { data_providers } from "src/constants";
import { User } from "../entities/user.entity";

export const userProvider = [
  {
    provide: data_providers.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [data_providers.DATA_SOURCE]
  }
];
