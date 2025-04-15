import { forwardRef, Module } from '@nestjs/common';
import { UnusualService } from './unusual.service';
import { UnusualController } from './unusual.controller';
import { unusualProvider } from './providers/unusual.providers';
import { PsychologistsModule } from './psychologists.module';
import { DatabaseModule } from '../database/database.module';
import { MeetingsModule } from 'src/meetings/meetings.module';

@Module({
  controllers: [UnusualController],
  providers: [...unusualProvider, UnusualService],
  imports: [DatabaseModule, MeetingsModule, forwardRef(() => PsychologistsModule),],
  exports: [UnusualService],
})
export class UnusualModule { }
