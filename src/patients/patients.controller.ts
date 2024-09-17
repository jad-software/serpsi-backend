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
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
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
  
  @ApiOperation({ summary: 'atualiza um paciente pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto
  ) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({ summary: 'atualiza a escola de um paciente pelo id' })
  @Put(':id/school')
  async updateSchool(
    @Param('id') id: string,
    @Body() school: UpdateSchoolDto
  ) {
    return await this.patientsService.updateSchool(id, school);
  }

  @ApiOperation({ summary: 'atualiza a lista de comorbidades de um paciente pelo id' })
  @ApiBody({
    type: CreateComorbidityDto,
    isArray: true
  })
  @Put(':id/comorbities')
  async addComorbities(
    @Param('id') id: string,
    @Body() comorbities: CreateComorbidityDto[]
  ) {
    return await this.patientsService.addComorbities(id, comorbities);
  }

  @ApiOperation({ summary: 'adiciona medicamentos para lista de um paciente pelo id (se a conexão com o remedio já existir ele atualiza)' })
  @ApiBody({
    type: CreateMedicamentInfoDto,
    isArray: true
  })
  @Put(':id/medicament')
  async addMedicaments(
    @Param('id') id: string,
    @Body() medicaments: CreateMedicamentInfoDto[]
  ) {
    return await this.patientsService.addMedicaments(id, medicaments);
  }

  @ApiOperation({ summary: 'deleta um paciente pelo id' })
  @Delete(':id/medicament/:medId')
  async removeMedicaments(@Param('id') id: string, @Param('medId') medId: string) {
    return await this.patientsService.removeMedicament(id, medId);
  }

  @ApiOperation({ summary: 'deleta um paciente pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientsService.remove(id);
  }
}
