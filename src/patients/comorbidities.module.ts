import { Module } from '@nestjs/common';
import { ComorbiditiesService } from './comorbidities.service';
import { ComorbiditiesController } from './comorbidities.controller';
import { DatabaseModule } from '../database/database.module';
import { comorbidityProvider } from './providers/comorbity.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ComorbiditiesController],
  providers: [ComorbiditiesService, ...comorbidityProvider],
  exports: [ComorbiditiesService],
})
export class ComorbiditiesModule {}
