import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  @ApiOperation({ summary: 'Criação de um novo paciente' })
  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientsService.create(createPatientDto);
  }

  @ApiOperation({ summary: 'lista todos os pacientes' })
  @Get()
  async findAll() {
    return await this.patientsService.findAll();
  }

  @ApiOperation({ summary: 'retorna um paciente pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findOne(id);
  }

  @ApiOperation({ summary: 'retorna uma escola pelo nome ou cnpj' })
  @Post('/school')
  async findOneSchool(@Query() search?: UpdateSchoolDto) {
    return await this.patientsService.findOneSchool(search);
  }

  @ApiOperation({ summary: 'atualiza um paciente pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto
  ) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({ summary: 'deleta um paciente pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientsService.remove(id);
  }
}
