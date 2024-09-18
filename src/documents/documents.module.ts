import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { documentProvider } from './providers/document.provider';
import { DatabaseModule } from 'src/database/database.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [CloudinaryModule, DatabaseModule, PatientsModule],
  controllers: [DocumentsController],
  providers: [...documentProvider, DocumentsService],
})
export class DocumentsModule {}
