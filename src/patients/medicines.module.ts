import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';

@Module({
  providers: [MedicinesService],
})
export class MedicinesModule {}
