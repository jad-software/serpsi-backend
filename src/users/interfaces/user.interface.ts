import { Role } from '../vo/role.enum';
import { Email } from '../vo/email.vo';

export interface IUser {
  email: Email | string;
  password: string;
  role: Role;
}
