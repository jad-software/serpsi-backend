import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { FindBusyDaysDAO } from '../application/getBusyDays/findBusyDays.dao';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/providers/user.decorator';
import { GetScheduleDAO } from '../application/getSchedule/getSchedule.dao';

@ApiTags('meetings')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) { }

  @ApiBody({ type: CreateMeetingDto })
  @ApiOperation({ summary: 'Cria uma sessão com horário, id do psicólogo e do paciente' })
  @Post('/onesession')
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingsService.create(createMeetingDto);
  }
  /**
   * @bug não está funcionando ainda
   * @param createMeetingDto 
   * @returns 
   */
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

  @ApiOperation({ summary: 'Atualiza uma sessão' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto
  ) {
    return await this.meetingsService.update(id, updateMeetingDto);
  }
  @ApiOperation({ summary: 'Deleta uma sessão' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingsService.remove(id);
  }
}
