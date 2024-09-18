import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(data_providers.DOCUMENT_REPOSITORY)
    private documentRepository: Repository<Document>,
    @Inject()
    private cloudinaryService: CloudinaryService,
    @Inject()
    private patientService: PatientsService
  ) { }
  async create(
    documentName: string,
    personId: string,
    documentFile: Express.Multer.File
  ): Promise<Document> {
    try {

      const fileSaved = await this.cloudinaryService.uploadFile(documentFile);
      const patient = await this.patientService.findOne(personId);
      if (fileSaved) {
        const document = new Document({
          title: documentName,
          docLink: fileSaved.url,
        });
        document.patient = patient;
        const createdDocument = await this.documentRepository.save(document);
        return createdDocument;
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findAllByPatient(patientId: string) {
    try {
      const documentsByPatientId = await this.documentRepository
            .createQueryBuilder('document')
            .where('document.Patient_id = :patientId',{patientId})
            .leftJoinAndSelect("document._patient", "patient")
            .getMany();
        return documentsByPatientId;
    }
    catch(err){
      throw new BadRequestException(err?.message);
    }
  }

  async findOne(id: string): Promise<Document> {
    try {
      const document = await this.documentRepository
        .createQueryBuilder('document')
        .where('document._id = :id ', { id })
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
        await this.documentRepository.remove(foundDocument);
        await this.cloudinaryService.deleteFileOtherThanImage(publicID);
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
