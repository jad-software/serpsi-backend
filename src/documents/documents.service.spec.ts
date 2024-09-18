import { Repository } from "typeorm";
import { DocumentsService } from "./documents.service"
import { Test, TestingModule } from "@nestjs/testing";
import { data_providers } from "../constants";
import { PatientsService } from "../patients/patients.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Id } from "../entity-base/vo/id.vo";
import { Document } from "./entities/document.entity";


describe('Documents Services', () => {
  let service: DocumentsService;
  let patientService: PatientsService;
  let cloudinaryService: CloudinaryService;

  let mockRepository: Partial<Record<keyof Repository<Document>, jest.Mock>>;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    getOneOrFail: jest.Mock;
    getMany: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getMany: jest.fn()
  };
  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: data_providers.DOCUMENT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: PatientsService,
          useValue:{
            findOne: jest.fn()
          }
        },
        {
          provide: CloudinaryService,
          useValue: {
            deleteFileOtherThanImage: jest.fn()
          }
        }
      ],
    }).compile();
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should Return one Document by Id', async() => {
    const id = new Id('8be7ffed-d32a-4c2d-b456-9350b461cf8a');
    const document = new Document({
      title: 'Titulo do documento',
      docLink: 'documento/link'
    });
    document.id = id;
    mockQueryBuilder.getOneOrFail.mockReturnValue(document);
    const result = await service.findOne(document.id.id);
    const idID = id.id;
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('document');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('document._id = :id', {
      id: idID
    });
    expect(mockQueryBuilder.getOneOrFail).toHaveBeenCalled();
    expect(result).toEqual(document);
  })
})