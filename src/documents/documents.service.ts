import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(data_providers.DOCUMENT_REPOSITORY)
    private documentRepository: Repository<Document>,
    @Inject()
    private cloudinaryService: CloudinaryService
  ) {
  }
  async create(documentName: string, documentFile: Express.Multer.File): Promise<Document> {
    try {
      const fileSaved = await this.cloudinaryService.uploadFile(documentFile);
      if (fileSaved) {
        const document = new Document({ title: documentName, docLink: fileSaved.url });
        const createdDocument = await this.documentRepository.save(document);
        return createdDocument;
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }

  }

  findAll() {
    return `This action returns all documents`;
  }

  async findOne(id: string): Promise<Document> {
    try {
      const document = await this.documentRepository
        .createQueryBuilder('document')
        .where('document._id = :id ', { id })
        .getOneOrFail();
      return document;
    }
    catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  async remove(id: string) {
    try {
      const foundDocument = await this.findOne(id);
      
      if (foundDocument) {
        const publicID = foundDocument.docLink.split('/').slice(-1)[0];
        await this.documentRepository.remove(foundDocument);
        await this.cloudinaryService.deleteFileOtherThanImage(publicID)
        
      }
    }
    catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
