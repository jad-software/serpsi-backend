import { Repository } from "typeorm";
import { DocumentsService } from "./documents.service"
import { Test, TestingModule } from "@nestjs/testing";
import { data_providers } from "../constants";
import { PatientsService } from "../patients/patients.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Id } from "../entity-base/vo/id.vo";
import { Document } from "./entities/document.entity";
import { Patient } from "../patients/entities/patient.entity";


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
    leftJoinAndSelect: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getMany: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis()
  };
  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
      remove: jest.fn(),
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
          useValue: {
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
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should Return one Document by Id', async () => {
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
  });

  it('Should return all documents of an patient', async () => {
    const patientId = new Id('2f3cf102-4bff-41c8-bcfe-417d52b60e0d');
    const patient = new Patient({});
    patient.id = patientId;
    const documents: Document[] = [
      new Document({
        title: 'Documento da sessão 1',
        docLink: 'Link1/link',
        patient: patientId.id
      }),
      new Document({
        title: 'Documento da sessão 2',
        docLink: 'Link2/link',
        patient: patientId.id
      })
    ];
    documents[0].id = new Id('f6ce1411-c3bb-42d6-a719-b1b6a7d2e073');
    documents[1].id = new Id('807af314-938c-48c1-8060-c23827beb41f');

    mockQueryBuilder.getMany.mockReturnValue(documents);
    const result = await service.findAllByPatient(patientId.id);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('document');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('document.Patient_id = :patientId', 
      { patientId: patientId.id });
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('document._patient', 'patient');
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual(documents);
  });

  it('should remove a document By id', async() => {
    const id = new Id('8be7ffed-d32a-4c2d-b456-9350b461cf8a');
    const document = new Document({
      title: 'Titulo do documento',
      docLink: 'documento/link',
    });
    document.id = id;
    const publicID = document.docLink.split('/').slice(-1)[0];
    
    mockRepository.remove.mockResolvedValue({ affected: 1 });
    await service.remove(id.id);
    expect(mockRepository.remove).toHaveBeenCalledWith(document);
    expect(cloudinaryService.deleteFileOtherThanImage).toHaveBeenCalledWith(publicID);
  });
})