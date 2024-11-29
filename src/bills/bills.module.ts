import { Module } from '@nestjs/common';
import { BillsService } from './infra/bills.service';
import { BillsController } from './infra/bills.controller';
import { billsProvider } from './infra/providers/bills.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BillsController],
  providers: [BillsService, ...billsProvider],
  imports: [DatabaseModule],
  exports: [BillsService],
})
export class BillsModule { }
