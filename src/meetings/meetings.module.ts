import { Module } from '@nestjs/common';
import { MeetingsService } from './infra/meetings.service';
import { MeetingsController } from './infra/meetings.controller';
import { meetingsProvider } from './infra/providers/meetings.providers';
import { DatabaseModule } from 'src/database/database.module';
import { PsychologistsModule } from 'src/psychologists/psychologists.module';
import { PatientsModule } from 'src/patients/patients.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, ...meetingsProvider],
  imports: [
    DatabaseModule,
    PsychologistsModule,
    PatientsModule,
    DocumentsModule  
  ],
  exports: [MeetingsService],
})
export class MeetingsModule { }
