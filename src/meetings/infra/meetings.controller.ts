import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { FindBusyDaysDAO } from '../application/getBusyDays/findBusyDays.dao';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../auth/providers/user.decorator';
import { GetScheduleDAO } from '../application/getSchedule/getSchedule.dao';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@ApiTags('meetings')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) { }

  @ApiBody({ type: CreateMeetingDto })
  @ApiOperation({ summary: 'Cria várias sessões com horário, id do psicólogo e do paciente' })
  @Post()
  async createMany(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingsService.create(createMeetingDto);
  }

  @ApiOperation({ summary: 'retorna todos os dias cheios e vazios do mês selecionado' })
  @Get('/busydays')
  async getAllBusyDays(@User() userInfo, @Query() search: FindBusyDaysDAO) {
    return await this.meetingsService.getBusyDays(
      userInfo.id,
      search.month
    );
  }

  @ApiOperation({ summary: 'retorna os horários disponiveis de um dia específico (não adianta passar endDate)' })
  @Get('/avaliable_times')
  async getAvaliableTimes(@User() userInfo, @Query() search: GetScheduleDAO) {
    const startDate = new Date(search.startDate);
    return await this.meetingsService.AvaliableTimes(
      userInfo.id,
      startDate
    );
  }

  @ApiOperation({ summary: 'retorna as sessões presentes em um intervalo' })
  @Get('/interval')
  async getSessionsByInterval(@User() userInfo, @Query() search: GetScheduleDAO) {
    return await this.meetingsService.getSessionsByInterval(userInfo.id, search.startDate, search.endDate);
  }

  @ApiOperation({ summary: 'retorna uma sessão específica' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza o status de uma sessão' })
  @Patch('/status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDTO: UpdateStatusDto
  ) {
    return await this.meetingsService.updateStatus(id, updateStatusDTO);
  }

  @ApiOperation({ summary: 'Atualiza o status de uma sessão' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDTO: UpdateMeetingDto
  ) {
    return await this.meetingsService.update(id, updateMeetingDTO);
  }

  @ApiOperation({ summary: 'Deleta uma sessão' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingsService.remove(id);
  }
}
