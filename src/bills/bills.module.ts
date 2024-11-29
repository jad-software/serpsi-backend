import { Module } from '@nestjs/common';
import { BillsService } from './infra/bills.service';
import { BillsController } from './infra/bills.controller';
import { billsProvider } from './infra/providers/bills.providers';
import { DatabaseModule } from 'src/database/database.module';
import { PsychologistsModule } from 'src/psychologists/psychologists.module';
import { MeetingsModule } from 'src/meetings/meetings.module';

@Module({
  controllers: [BillsController],
  providers: [BillsService, ...billsProvider],
  imports: [DatabaseModule, PsychologistsModule, MeetingsModule],
  exports: [BillsService],
})
export class BillsModule { }
