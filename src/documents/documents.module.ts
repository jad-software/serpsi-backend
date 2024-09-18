import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { documentProvider } from './providers/document.provider';
import { DatabaseModule } from '../database/database.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [CloudinaryModule, DatabaseModule, PatientsModule],
  controllers: [DocumentsController],
  providers: [...documentProvider, DocumentsService],
})
export class DocumentsModule {}
