import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwt_constants } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_constants.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      id: payload.sub,
      role: payload.role,
    };
  }
}
