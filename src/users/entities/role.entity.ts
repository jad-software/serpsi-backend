import { EntityBase } from "src/entity-base/entities/entity-base";
import { Column, Entity } from "typeorm";

@Entity()
export class Role extends EntityBase {
  constructor(name: string) {
    super();
    this.name = name;
  }
  @Column()
  private name: string;
}
