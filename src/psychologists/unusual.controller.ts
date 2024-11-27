import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UnusualService } from './unusual.service';
import { CreateUnusualDto } from './dto/create-unusual.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AvailableTimeDto } from './dto/create-agenda.dto';

@ApiTags('agendas')
@ApiBearerAuth()
@Controller('unusual')
export class UnusualController {
  constructor(private readonly unusualService: UnusualService) { }
  validateAvaliableTime(unusual: CreateUnusualDto[]) {
    unusual.forEach((un) => {
      const ValidatedUnusual: AvailableTimeDto[] = [];
      un.avaliableTimes.forEach((time) => {
        if (
          time._endTime.trim() === '' ||
          time._startTime.trim() === ''
        ) {
          throw new BadRequestException(
            'startTime e endTime não podem ser vazios'
          );
        } else if (time._endTime <= time._startTime) {
          throw new BadRequestException(
            'endTime tem que ser maior que startTime'
          );
        }
        if (ValidatedUnusual) {
          ValidatedUnusual.forEach((agendaV) => {
            console.log('AGENDA -----------> ', agendaV._endTime, time._startTime);
            if (agendaV._endTime >= time._startTime) {
              console.log('entrou')
              throw new BadRequestException(
                'startTime de uma nova agenda  tem que ser maior que o endTime da outra'
              );
            }
          });
        }
        ValidatedUnusual.push(time);
      });
    });
  }

  @ApiOperation({ summary: 'Criação de uma nova agenda fora do comum' })
  @Post('')
  @ApiBody({ type: [CreateUnusualDto] })
  async create(@Body() createUnusualDto: CreateUnusualDto[]) {
    try{
      this.validateAvaliableTime(createUnusualDto);
    }
    catch(e){
      throw new BadRequestException(e.message);
    }
    const promisesUnusuals = createUnusualDto.map((unusual) => this.unusualService.create(unusual));
    return await Promise.all(promisesUnusuals);
  }

  @ApiOperation({ summary: 'Listagem de todas as agendas incomuns' })
  @Get('')
  async findAll() {
    return this.unusualService.findAll();
  }

  @ApiOperation({ summary: 'Listagem de todas as agendas de um psicólogo' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.unusualService.findAllFromPsychologist(id);
  }

  @ApiOperation({ summary: 'remove a agenda incomum de um psicólogo' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.unusualService.remove(id);
  }
}
