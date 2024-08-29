import { EntityBase } from "src/entity-base/entities/entity-base";
import { Column, Entity } from "typeorm";
import { CreateRoleDto } from "../dto/create-role.dto";

@Entity()
export class Role extends EntityBase {
  constructor(partial: Partial<CreateRoleDto>) {
    super();
    Object.assign(this, partial);
  }
  @Column({name: 'name'})
  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(val: string) {
    this._name = val;
  }
}
