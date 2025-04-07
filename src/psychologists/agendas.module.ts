import { forwardRef, Module } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';
import { DatabaseModule } from '../database/database.module';
import { agendaProvider } from './providers/agenda.providers';
import { PsychologistsModule } from './psychologists.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AgendasController],
  imports: [DatabaseModule, forwardRef(() => PsychologistsModule), UsersModule],
  providers: [...agendaProvider, AgendasService],
})
export class AgendasModule { }
