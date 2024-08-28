import { DataSource } from "typeorm";
import { Role } from "../entities/role.entity";
import { data_providers } from "src/constants";

export const roleProvider = [
  {
    provide: data_providers.ROLE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: [data_providers.DATA_SOURCE]
  }
];
