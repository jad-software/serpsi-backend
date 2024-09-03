import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { medicineProvider } from './providers/medicine.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MedicinesService, ...medicineProvider],
  exports: [MedicinesService],
})
export class MedicinesModule {}
