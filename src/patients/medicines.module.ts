import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { medicineProvider } from './providers/medicine.provider';
import { DatabaseModule } from '../database/database.module';
import { MedicamentInfoService } from './medicament-info.service';
import { medicamentInfoProvider } from './providers/medicament-info.provider';
import { ComorbiditiesModule } from './comorbidities.module';
import { MedicinesController } from './medicines.controller';

@Module({
  imports: [DatabaseModule, ComorbiditiesModule],
  controllers: [MedicinesController],
  providers: [
    MedicinesService,
    ...medicineProvider,
    MedicamentInfoService,
    ...medicamentInfoProvider,
  ],
  exports: [MedicinesService],
})
export class MedicinesModule {}
