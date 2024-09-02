import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let mockAuthService = {
    login: jest.fn((loginDto) => {
      if (
        loginDto.email === 'psi@teste.com' &&
        loginDto.password === 'senhaSecreta'
      ) {
        return Promise.resolve({
          payload: {
            email: 'psi@teste.com',
            sub: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
            role: 'PSI',
          },
          token: 'um token bearer bem bonito',
        });
      } else {
        return Promise.reject(new UnauthorizedException('Invalid credentials'));
      } 
    }),
    validateUser: jest.fn((email: string, password: string) => {
      return Promise.resolve({
        email,
        password,
        id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        role: 'PSI',
      })
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/auth/login', async () => {
    const loginPayload = {
      email: 'psi@teste.com',
      password: 'senhaSecreta',
    };

    return await request(app.getHttpServer())
      .post('/auth/login')
      .expect(201)
      .send(loginPayload)
      .expect({
        payload: {
          email: 'psi@teste.com',
          sub: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
          role: 'PSI',
        },
        token: 'um token bearer bem bonito',
      });
  });

  it('/auth/login (POST) - invalid credentials', async () => {
    const invalidPayload = {
      email: 'wrong@teste.com',
      password: 'wrongPassword',
    };
  
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(invalidPayload)
      .expect(401);
  });


  afterAll(async () => {
    await app.close();
  });
});
