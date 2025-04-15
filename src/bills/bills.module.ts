import { forwardRef, Module } from '@nestjs/common';
import { BillsService } from './infra/bills.service';
import { BillsController } from './infra/bills.controller';
import { billsProvider } from './infra/providers/bills.providers';
import { DatabaseModule } from '../database/database.module';
import { PsychologistsModule } from '../psychologists/psychologists.module';

@Module({
  controllers: [BillsController],
  providers: [BillsService, ...billsProvider],
  imports: [DatabaseModule, forwardRef(() => PsychologistsModule)],
  exports: [BillsService],
})
export class BillsModule { }
