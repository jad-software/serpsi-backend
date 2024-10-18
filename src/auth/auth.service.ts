import { PsychologistsService } from './../psychologists/psychologists.service';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject()
    private psychologistService:PsychologistsService
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User) {
    let id = user.id.id;
    if(user.role === 'PSI'){
      const psychologist = await this.psychologistService.findOneByUser(user.id.id);
      id = psychologist.id.id;
    }
    
    const payload = {
      email: user.email.email,
      sub: id,
      role: user.role,
    };
    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
