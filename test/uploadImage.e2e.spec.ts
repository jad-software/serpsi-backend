import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../src/persons/entities/person.enitiy';
import { PersonsController } from '../src/persons/persons.controller';
import { PersonsService } from '../src/persons/persons.service';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Address } from '../src/addresses/entities/address.entity';
import { Cpf } from '../src/persons/vo/cpf.vo';
import { Phone } from '../src/persons/vo/phone.vo';

describe('PersonsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let personRepository: Repository<Person>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dataSource = moduleRef.get<DataSource>(DataSource);
    personRepository = dataSource.getRepository(Person);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a person with a profile picture', async () => {
    const createPersonDto = {
      name: 'John Doe',
      birthdate: '1990-01-01',
      phone: new Phone('+1', '123', '4567890'),
      cpf: new Cpf('123.456.789-00'),
      rg: '12.345.678-9',
      address: new Address({
        street: 'Test Street',
        zipCode: '12345',
        state: 'Test State',
        district: 'Test District',
        homeNumber: 123,
      }),
    };

    const response = await request(app.getHttpServer())
      .post('/persons/picture')
      .attach('profilePicture', Buffer.from(''), 'test.png') 
      .field('personData', JSON.stringify(createPersonDto))
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(createPersonDto));
  });
});
