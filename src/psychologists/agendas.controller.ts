import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { AvailableTimeDto, CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('agendas')
@ApiBearerAuth()
@Controller('agendas')
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) { }
  validateAvaliableTime(agenda: CreateAgendaDto | UpdateAgendaDto) {

    agenda.agendas.forEach(a => {
      const agendasValidadas: AvailableTimeDto[] = [];
      a._avaliableTimes.forEach(timeOfDay => {
        if (timeOfDay._endTime.trim() === '' || timeOfDay._startTime.trim() === '') {
          throw new BadRequestException('startTime e endTime não podem ser vazios');
        }
        else if (timeOfDay._endTime <= timeOfDay._startTime) {
          throw new BadRequestException('endTime tem que ser maior que startTime');
        }
        if (agendasValidadas) {
          agendasValidadas.forEach(agendaV => {
            if (agendaV._endTime >= timeOfDay._startTime) {
              throw new BadRequestException(
                'startTime de uma nova agenda  tem que ser maior que o endTime da outra'
              );
            }
          })
        }
        agendasValidadas.push(timeOfDay);

      })
    });
  }
  @ApiOperation({ summary: 'Criação de uma nova agenda' })
  @Post()
  async create(@Body() createAgendaDto: CreateAgendaDto) {
    this.validateAvaliableTime(createAgendaDto)
    return await this.agendasService.create(createAgendaDto);
  }

  @ApiOperation({ summary: 'Listagem de todas as agendas' })
  @Get()
  findAll() {
    return this.agendasService.findAll();
  }

  @ApiOperation({ summary: 'Listagem de todas as agendas de um psicólogo' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendasService.findAllFromPsychologist(id);
  }

  @ApiOperation({ summary: 'Atualiza da agenda de um psicólogo' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    this.validateAvaliableTime(updateAgendaDto)
    return this.agendasService.update(id, updateAgendaDto);
  }

  @ApiOperation({ summary: 'Deleta da agenda de um psicólogo' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.agendasService.remove(id);
  }
}
