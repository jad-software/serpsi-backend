import { Module } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';
import { DatabaseModule } from 'src/database/database.module';
import { agendaProvider } from './providers/agenda.providers';

@Module({
  controllers: [AgendasController],
  imports: [DatabaseModule],
  providers: [...agendaProvider, AgendasService],
})
export class AgendasModule { }
