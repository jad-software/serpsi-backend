import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { PatientsService } from '../patients/patients.service';
import { MeetingsService } from '../meetings/infra/meetings.service';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(data_providers.DOCUMENT_REPOSITORY)
    private documentRepository: Repository<Document>,
    @Inject()
    private cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => MeetingsService))
    private meetingService: MeetingsService
  ) { }
  async create(
    documentName: string,
    meeetingId: string,
    documentFile: Express.Multer.File
  ): Promise<Document> {
    try {
      const formatOfFile = documentFile.originalname.split(".").at(-1);
      const meeting = await this.meetingService.findOne(meeetingId, true);
      const fileSaved = await this.cloudinaryService.uploadFile(documentFile, formatOfFile === 'pdf');
      if (fileSaved) {
        const document = new Document({
          title: documentName,
          docLink: fileSaved.url,
        });
        document.meeting = meeting;
        document.patient = meeting.patient;
        const createdDocument = await this.documentRepository.save(document);
        return createdDocument;
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async createFollowUps(
    patientId: string,
    followUps: Express.Multer.File[]
  ): Promise<Document[]> {
    const queryRunner =
      this.documentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    let publicsIds: string[] = [];
    try {
      await queryRunner.startTransaction();
      let returnedFollowUps: Document[] = [];
      const patient = await this.patientService.findOne(patientId);
      for (const documentFile of followUps) {
        documentFile.originalname = Buffer.from(
          documentFile.originalname,
          'latin1'
        ).toString('utf8');

        const fileSaved = await this.cloudinaryService.uploadFile(
          documentFile,
          true
        );
        if (fileSaved) {
          const document = new Document({
            title: documentFile.originalname,
            docLink: fileSaved.url,
          });
          document.patient = patient;
          publicsIds.push(document.docLink.split('/').slice(-1)[0]);
          returnedFollowUps.push(await queryRunner.manager.save(document));
        }
      }
      await queryRunner.commitTransaction();
      return returnedFollowUps;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      publicsIds.forEach(async (publicID) => {
        await this.cloudinaryService.deleteFileOtherThanImage(publicID);
      });

      throw new BadRequestException(err?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByPatient(patientId: string) {
    try {
      const documentsByPatientId = await this.documentRepository
        .createQueryBuilder('document')
        .where('document.Patient_id = :patientId', { patientId })
        .leftJoinAndSelect('document._patient', 'patient')
        .getMany();
      return documentsByPatientId;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findAllByPsychologist(psychologistId: string) {
    try {
      const documents = await this.documentRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document._patient', 'patient')
        .leftJoinAndSelect('patient._person', 'person')
        .leftJoinAndSelect('document.meeting', 'meeting')
        .select('document._id._id', 'id')
        .addSelect('document._title', 'title')
        .addSelect('document._docLink', 'docLink')
        .addSelect('person._name', 'name')
        .addSelect('meeting.schedule', 'createDate')
        .where('patient.Psychologist_id = :psychologistId', { psychologistId })
        .getRawMany();
      return documents;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findOne(id: string): Promise<Document> {
    try {
      const document = await this.documentRepository
        .createQueryBuilder('document')
        .where('document._id = :id', { id })
        .getOneOrFail();
      return document;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async update(id: string, title?: string, documentFile?: Express.Multer.File) {
    try {
      const foundDocument = await this.findOne(id);

      if (title) {
        foundDocument.title = title;
      }
      if (documentFile) {
        const oldDocument = foundDocument.docLink;
        if (oldDocument) {
          const publicID = oldDocument.split('/').slice(-1)[0];
          await this.cloudinaryService.deleteFileOtherThanImage(publicID);
        }

        const fileSaved = await this.cloudinaryService.uploadFile(documentFile);
        if (fileSaved) {
          const document = new Document({ title, docLink: fileSaved.url });
          foundDocument.docLink = fileSaved.url;
        }
      }
      const createdDocument = await this.documentRepository.save(foundDocument);
      return createdDocument;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async remove(id: string) {
    try {
      const foundDocument = await this.findOne(id);

      if (foundDocument) {
        const publicID = foundDocument.docLink.split('/').slice(-1)[0];
        if (foundDocument.docLink.includes("image"))
          await this.cloudinaryService.deleteFile(publicID.split('.').at(0));
        else
          await this.cloudinaryService.deleteFileOtherThanImage(publicID);

        await this.documentRepository.remove(foundDocument);
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
