import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSchoolDto } from './dto/school/create-school.dto';
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import { SchoolService } from './school.service';

@ApiTags('school')
@ApiBearerAuth()
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @ApiOperation({ summary: 'retorna uma escola pelo nome ou cnpj' })
  @Post('/search')
  async findOneSchool(@Query() search?: UpdateSchoolDto) {
    return await this.schoolService.findOneBy(search);
  }
}
