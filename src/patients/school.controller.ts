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
import { FindSchoolDto } from './dto/school/find-school.dto';
import { SchoolService } from './school.service';

@ApiTags('school')
@ApiBearerAuth()
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @ApiOperation({ summary: 'retorna uma escola pelo nome ou cnpj' })
  @Get('/search')
  async findOneSchool(@Query() search?: FindSchoolDto) {
    return await this.schoolService.findOneBy(search);
  }
}
