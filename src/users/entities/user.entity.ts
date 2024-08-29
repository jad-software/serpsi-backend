import { Email } from '../vo/email.vo';
import { Role } from './role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from 'src/entity-base/entities/entity-base';
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
  private email: Email;

  @Column()
  private password: string;

  @ManyToOne(() => Role)
  public role: Role;

  public getEmail(): Email {
    return this.email;
  }
  public setEmail(email: Email): void {
    this.email = email;
  }
  public getRole(): Role {
    return this.role;
  }
  public setRole(role: Role): void {
    this.role = role;
  }
  public getPassword(): string {
    return this.password;
  }
  public setPassword(password: string): void {
    this.password = password;
  }
}
