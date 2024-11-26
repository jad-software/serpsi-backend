import { forwardRef, Module } from '@nestjs/common';
import { MeetingsService } from './infra/meetings.service';
import { MeetingsController } from './infra/meetings.controller';
import { meetingsProvider } from './infra/providers/meetings.providers';
import { DatabaseModule } from '../database/database.module';
import { PsychologistsModule } from '../psychologists/psychologists.module';
import { PatientsModule } from '../patients/patients.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, ...meetingsProvider],
  imports: [
    DatabaseModule,
    PsychologistsModule,
    forwardRef(() => PatientsModule),
    forwardRef(() => DocumentsModule)
  ],
  exports: [MeetingsService],
})
export class MeetingsModule { }
