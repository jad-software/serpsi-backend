import { forwardRef, Module } from '@nestjs/common';
import { UnusualService } from './unusual.service';
import { UnusualController } from './unusual.controller';
import { unusualProvider } from './providers/unusual.providers';
import { PsychologistsModule } from './psychologists.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [UnusualController],
  providers: [...unusualProvider, UnusualService],
  imports: [DatabaseModule, forwardRef(() => PsychologistsModule)],
  exports: [UnusualService],
})
export class UnusualModule { }
