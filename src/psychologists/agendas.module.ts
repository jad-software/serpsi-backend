import { forwardRef, Module } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';
import { DatabaseModule } from '../database/database.module';
import { agendaProvider } from './providers/agenda.providers';
import { PsychologistsModule } from './psychologists.module';

@Module({
  controllers: [AgendasController],
  imports: [DatabaseModule, forwardRef(() => PsychologistsModule)],
  providers: [...agendaProvider, AgendasService],
})
export class AgendasModule {}
