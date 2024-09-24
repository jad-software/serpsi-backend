import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { schoolProvider } from './providers/school.provider';
import { DatabaseModule } from '../database/database.module';
import { SchoolController } from './school.controller';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [DatabaseModule, AddressesModule],
  controllers: [SchoolController],
  providers: [SchoolService, ...schoolProvider],
  exports: [SchoolService],
})
export class SchoolModule {}
