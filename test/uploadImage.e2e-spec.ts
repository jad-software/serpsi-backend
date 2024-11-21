import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import {
  INestApplication,
} from '@nestjs/common';
import { PersonsService } from '../src/persons/persons.service';
import { PersonsModule } from '../src/persons/persons.module';

describe('PersonsController (e2e)', () => {
  let app: INestApplication;
  let mockPersonService = {
    create: jest.fn((createPersonDto) => {
      return Promise.resolve({
        name: 'John Doe',
        birthdate: '1990-01-01',
        phone: {
          ddi: '+55',
          ddd: '75',
          number: '99981798',
        },
        rg: '12.345.678-9',
        cpf: {
          cpf: '111.184.119-50',
        },

        address: {
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          district: 'Test District',
          homeNumber: 123,
          complement: 'Test Complement',
        },
      });
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PersonsModule],
    })
      .overrideProvider(PersonsService)
      .useValue(mockPersonService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a person with a profile picture', async () => {
    const createPersonDto = {
      name: 'John Doe',
      birthdate: '1990-01-01',
      phone: {
        ddi: '+55',
        ddd: '75',
        number: '99981798',
      },
      rg: '12.345.678-9',
      cpf: {
        cpf: '111.184.119-50',
      },

      address: {
        street: 'Test Street',
        zipCode: '12345',
        state: 'Test State',
        district: 'Test District',
        homeNumber: 123,
        complement: 'Test Complement',
      },
    };

    const response = await request(app.getHttpServer())
      .post('/persons/picture')
      .attach('profilePicture', Buffer.from(''), 'test.png')
      .field('personData', JSON.stringify(createPersonDto))
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(createPersonDto));
  });

  it('should not create a person with missing field', async () => {
    const createPersonDto = {
      // name: 'John Doe',
      birthdate: '1990-01-01',
      phone: {
        ddi: '+55',
        ddd: '75',
        number: '99981798',
      },
      rg: '12.345.678-9',
      cpf: {
        cpf: '111.184.119-50',
      },

      address: {
        street: 'Test Street',
        zipCode: '12345',
        state: 'Test State',
        district: 'Test District',
        homeNumber: 123,
        complement: 'Test Complement',
      },
    };

    const response = await request(app.getHttpServer())
      .post('/persons/picture')
      .attach('profilePicture', Buffer.from(''), 'test.png')
      .field('personData', JSON.stringify(createPersonDto))
      .expect(400);
    const error = {
      error: 'Bad Request',
      message: 'Validation Error in Field: name',
      statusCode: 400,
    };
    expect(response.body).toEqual(expect.objectContaining(error));
  });

  it('should not create a person with profile picture not being an image format', async () => {
    const createPersonDto = {
      name: 'John Doe',
      birthdate: '1990-01-01',
      phone: {
        ddi: '+55',
        ddd: '75',
        number: '99981798',
      },
      rg: '12.345.678-9',
      cpf: {
        cpf: '111.184.119-50',
      },

      address: {
        street: 'Test Street',
        zipCode: '12345',
        state: 'Test State',
        district: 'Test District',
        homeNumber: 123,
        complement: 'Test Complement',
      },
    };

    const response = await request(app.getHttpServer())
      .post('/persons/picture')
      .attach('profilePicture', Buffer.from(''), 'test.pdf')
      .field('personData', JSON.stringify(createPersonDto))
      .expect(400);
    const error = {
      error: 'Bad Request',
      message: 'Validation failed (expected type is /(jpeg|png)$/)',
      statusCode: 400,
    };
    expect(response.body).toEqual(expect.objectContaining(error));
  });
});
