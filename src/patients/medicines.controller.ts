import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/medicine/create-medicine.dto';

@ApiTags('medicines')
@ApiBearerAuth()
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @ApiOperation({ summary: 'cria um novo medicamento' })
  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return await this.medicinesService.create(createMedicineDto);
  }

  @ApiOperation({ summary: 'lista todos os medicamentos' })
  @Get()
  async findAll() {
    return await this.medicinesService.findAll();
  }

  @ApiOperation({ summary: 'retorna um medicamento pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicinesService.findOne(id);
  }

  @ApiOperation({ summary: 'retorna um medicamento pelo nome' })
  @Post('/search')
  async findOneByName(@Query() search: CreateMedicineDto) {
    return await this.medicinesService.findByName(search.name);
  }

  @ApiOperation({ summary: 'deleta um medicamento pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.medicinesService.remove(id);
  }
}
