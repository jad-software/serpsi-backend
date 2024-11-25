import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Id } from '../entity-base/vo/id.vo';
import { Patient } from '../patients/entities/patient.entity';

describe('Documents Controller', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            createFollowUps: jest.fn(),
            remove: jest.fn(),
            findAllByPatient: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create a Document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Tille Controller teste',
        meeting: '65a588f1-0174-4e2c-b620-05b7c55adea5',
      };

      const document = new Document(createDocumentDto);
      jest.spyOn(service, 'create').mockResolvedValue(document);

      let file = {
        originalname: 'teste.md',
      } as Express.Multer.File;

      const result = await controller.create(createDocumentDto, file);

      expect(result).toEqual(document);
      expect(service.create).toHaveBeenCalledWith(
        document.title,
        document.meeting,
        file
      );
    });
  });

  describe('create a follow Up', () => {
    it('Should create a follow up Document', async () => {
      let documents: Document[] = [];
      let patient = '65a588f1-0174-4e2c-b620-05b7c55adea5';
      const createDocumentDto = [
        {
          title: 'Title Controller teste',
          patient
        },
        {
          title: 'Title Controller teste2',
          patient
        },
      ];
      createDocumentDto.map((previusFollowUps) => {
        documents.push(new Document(previusFollowUps));
      });

      jest.spyOn(service, 'createFollowUps').mockResolvedValue(documents);

      let files = [
        {
          originalname: 'Title Controller teste.pdf',
        },
        {
          originalname: 'Title Controller teste2.pdf',
        },
      ] as Express.Multer.File[];

      const result = await controller.createFollowups({ patient }, files);

      expect(result).toEqual(documents);
      expect(service.createFollowUps).toHaveBeenCalledWith(patient, files);
    });
  });
  describe('findOne', () => {
    it('should return a single document by ID', async () => {
      const id = new Id('1');
      const result = new Document({ title: 'doc1', patient: { id: new Id('13767676') } as Patient });
      result.id = id;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id.id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id.id);
    });
  });

  describe('findAllByPatient', () => {
    it('should return all documents for a given patient', async () => {
      const id = new Id('123');
      const result = [new Document({ title: 'doc1' })];
      result[0].id = id;
      jest.spyOn(service, 'findAllByPatient').mockResolvedValue(result);

      expect(await controller.findAllByPatient(id.id)).toBe(result);
      expect(service.findAllByPatient).toHaveBeenCalledWith(id.id);
    });
  });

  describe('update', () => {
    it('should call documentsService.update with correct values', async () => {
      const id = '1';
      const updateDto = 'Updated Title';
      const file = {
        originalname: 'updated.md',
      } as Express.Multer.File;

      await controller.update(id, file, updateDto);
      expect(service.update).toHaveBeenCalledWith(id, updateDto, file);
    });
  });
  describe('remove', () => {
    it('Should remove a Docuement by Id', async () => {
      const id = '1';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
