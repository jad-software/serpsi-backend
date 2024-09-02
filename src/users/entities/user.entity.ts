import { Email } from '../vo/email.vo';
import { Role } from '../vo/role.enum';
import { Column, Entity } from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';

@Entity()
export class User extends EntityBase implements IUser {
  constructor(partial: Partial<CreateUserDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column(() => Email, {
    prefix: false,
  })
  private _email: Email;

  @Column({ name: 'password', select: false })
  private _password: string;

  @Column({
    type: 'enum',
    name: 'role',
    enum: Role,
    default: Role.PSYCHOLOGIST,
  })
  private _role: Role;

  get email(): Email {
    return this._email;
  }
  set email(email: Email) {
    this._email = email;
  }

  get password(): string {
    return this._password;
  }
  set password(password: string) {
    this._password = password;
  }

  get role(): Role {
    return this._role;
  }
  set role(role: Role) {
    this._role = role;
  }
}
