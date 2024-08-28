import { Email } from '../vo/email.vo';
import { Role } from './role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from 'src/entity-base/entities/entity-base';
import { Exclude, Transform } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User extends EntityBase {
  constructor(partial: Partial<CreateUserDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column(() => Email, {
    prefix: false,
  })
  public email: Email;

  @Column()
  @Exclude({ toPlainOnly: true })
  public password: string;

  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role)
  public role: Role;

  public getEmail(): Email {
    return this.email;
  }
  public getRole(): Role {
    return this.role;
  }
}
