import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { logsProvider } from './providers/logs.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  exports: [LoggerService],
  providers: [LoggerService, ...logsProvider],
  imports: [
    DatabaseModule
  ],
})
export class LoggerModule { }
