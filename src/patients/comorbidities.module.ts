import { Module } from '@nestjs/common';
import { ComorbiditiesService } from './comorbidities.service';
import { ComorbiditiesController } from './comorbidities.controller';
import { DatabaseModule } from 'src/database/database.module';
import { comorbidityProvider } from './providers/comorbity.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ComorbiditiesController],
  providers: [ComorbiditiesService, ...comorbidityProvider],
})
export class ComorbitiesModule {}
