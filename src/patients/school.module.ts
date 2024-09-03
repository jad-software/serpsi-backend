import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { schoolProvider } from './providers/school.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SchoolService, ...schoolProvider],
  exports: [SchoolService],
})
export class SchoolModule {}
