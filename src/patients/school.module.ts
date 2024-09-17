import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { schoolProvider } from './providers/school.provider';
import { DatabaseModule } from '../database/database.module';
import { SchoolController } from './school.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SchoolController],
  providers: [SchoolService, ...schoolProvider],
  exports: [SchoolService],
})
export class SchoolModule {}
