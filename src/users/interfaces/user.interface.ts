import { Role } from '../entities/role.entity';
import { Email } from '../vo/email.vo';

export interface IUser {
  email: Email | string;
  password: string;
  role: Role | string;
}
