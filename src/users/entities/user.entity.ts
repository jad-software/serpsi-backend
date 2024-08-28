import { EntityBase } from "src/entity-base/entities/entity-base";
import { Email } from "../vo/email.vo";
import { Role } from "./role.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class User extends EntityBase{
  constructor(email: Email, password: string, role: Role) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
  }
  @Column(() => Email, {
    prefix: false,
  })
  private email: Email;
  @Column()
  private password: string;
  @ManyToOne(()=> Role)
  private role: Role;
}
