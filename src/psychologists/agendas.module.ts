import { forwardRef, Module } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';
import { DatabaseModule } from 'src/database/database.module';
import { agendaProvider } from './providers/agenda.providers';
import { PsychologistsModule } from './psychologists.module';
import { psychologistProvider } from './providers/psychologists.providers';

@Module({
  controllers: [AgendasController],
  imports: [DatabaseModule, forwardRef(() => PsychologistsModule),],
  providers: [...agendaProvider, ...psychologistProvider,AgendasService],
})
export class AgendasModule { }
