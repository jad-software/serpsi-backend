import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Controller('agendas')
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) {}

  @Post()
  async create(@Body() createAgendaDto: CreateAgendaDto) {
    return await this.agendasService.create(createAgendaDto);
  }

  @Get()
  findAll() {
    return this.agendasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendasService.findAllFromPsychologist(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    return this.agendasService.update(id, updateAgendaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.agendasService.remove(id);
  }
}
