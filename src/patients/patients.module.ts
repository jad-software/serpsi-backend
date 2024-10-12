import { forwardRef, Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { patientProvider } from './providers/patient.provider';
import { DatabaseModule } from '../database/database.module';
import { MedicinesModule } from './medicines.module';
import { SchoolModule } from './school.module';
import { ComorbiditiesModule } from './comorbidities.module';
import { PersonsModule } from '../persons/persons.module';
import { DocumentsModule } from '../documents/documents.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PsychologistsModule } from '../psychologists/psychologists.module';

@Module({
  imports: [
    DatabaseModule,
    MedicinesModule,
    SchoolModule,
    ComorbiditiesModule,
    PersonsModule,
    forwardRef(() => DocumentsModule),
    CloudinaryModule,
    PsychologistsModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService, ...patientProvider],
  exports: [PatientsService],
})
export class PatientsModule {}
