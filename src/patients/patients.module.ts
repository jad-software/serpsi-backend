import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { patientProvider } from './providers/patient.provider';
import { DatabaseModule } from '../database/database.module';
import { MedicinesModule } from './medicines.module';
import { SchoolModule } from './school.module';
import { ComorbiditiesModule } from './comorbidities.module';

@Module({
  imports: [DatabaseModule, MedicinesModule, SchoolModule, ComorbiditiesModule],
  controllers: [PatientsController],
  providers: [PatientsService, ...patientProvider],
  exports: [PatientsService],
})
export class PatientsModule {}
