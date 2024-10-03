import { Module } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';

@Module({
  controllers: [AgendasController],
  providers: [AgendasService],
})
export class AgendasModule {}
