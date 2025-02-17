import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/medicine/create-medicine.dto';

@ApiBearerAuth()
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @ApiOperation({ summary: 'retorna um medicamento pelo nome' })
  @Post('/search')
  async findOneByName(@Query() search: CreateMedicineDto) {
    return await this.medicinesService.findByName(search.name);
  }
}
