import { EntityBase } from "src/entity-base/entities/entity-base";
import { Column, Entity } from "typeorm";
import { CreateRoleDto } from "../dto/create-role.dto";

@Entity()
export class Role extends EntityBase {
  constructor(partial: Partial<CreateRoleDto>) {
    super();
    Object.assign(this, partial);
  }
  @Column()
  private name: string;
}
