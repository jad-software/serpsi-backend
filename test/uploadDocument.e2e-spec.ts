import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../src/documents/documents.service';
import * as request from 'supertest';
import { extname } from 'path';
import { DocumentsModule } from '../src/documents/documents.module';

describe('Upload Documenr (e2e)', () => {
  let app: INestApplication;
  let mockDocumentService = {
    create: jest.fn((title, patient, document) => {
      if (
        title === undefined ||
        patient === undefined ||
        document === undefined
      ) {
        return Promise.reject(new BadRequestException('Required fields'));
      } else if (extname(document.originalname) !== '.md') {
        return Promise.reject(
          new BadRequestException('Only .md files are allowed!')
        );
      } else {
        return Promise.resolve();
      }
    }),
    createFollowUps: jest.fn((patient, documents) => {
      if (patient === undefined) {
        return Promise.reject(new BadRequestException('Required fields'));
      }
      else {
        return Promise.resolve();
      }
    })
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DocumentsModule],
    })
      .overrideProvider(DocumentsService)
      .useValue(mockDocumentService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create an Document', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents')
      .attach('document', Buffer.from(''), 'teste.md')
      .field('patient', '44a1fc2c-7679-4237-ba10-547891a64aac')
      .field('title', 'Titulo do documento')
      .expect(201);
  });


  it('Should create an followUp Document', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents/followups')
      .attach('documents', Buffer.from(''), 'document1.pdf')
      .attach('documents', Buffer.from(''), 'document2.pdf') // caso queira testar múltiplos arquivos
      .field('patient', '44a1fc2c-7679-4237-ba10-547891a64aac')
      .expect(201);

  });

  it('Should not create an Document if field is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents')
      .attach('document', Buffer.from(''), 'teste.md')
      .field('title', 'Titulo do documento')
      .expect(400);
  });

  it('Should not create an Document if file is not an .md', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents')
      .attach('document', Buffer.from(''), 'teste.pdf')
      .field('patient', '44a1fc2c-7679-4237-ba10-547891a64aac')
      .field('title', 'Titulo do documento')
      .expect(400);
  });

  it('Should not create an FollowUp Document if files are not a .pdf', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents/followups')
      .attach('documents', Buffer.from(''), 'teste.pdf')
      .attach('documents', Buffer.from(''), 'teste2.md')
      .field('patient', '44a1fc2c-7679-4237-ba10-547891a64aac')
      .field('title', 'Titulo do documento')
      .expect(400);
  });
  
});
