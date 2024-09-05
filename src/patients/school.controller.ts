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
  @ApiOperation({ summary: 'Criação de um novo escola' })
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.create(createSchoolDto);
  }

  @ApiOperation({ summary: 'lista todos os escolas' })
  @Get()
  async findAll() {
    return await this.schoolService.findAll();
  }

  @ApiOperation({ summary: 'retorna um escola pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.schoolService.findOne(id);
  }

  @ApiOperation({ summary: 'retorna uma escola pelo nome ou cnpj' })
  @Post('/school')
  async findOneSchool(@Query() search?: UpdateSchoolDto) {
    return await this.schoolService.findOneBy(search);
  }

  @ApiOperation({ summary: 'atualiza um escola pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto
  ) {
    return await this.schoolService.update(id, updateSchoolDto);
  }

  @ApiOperation({ summary: 'deleta um escola pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.schoolService.remove(id);
  }
}
