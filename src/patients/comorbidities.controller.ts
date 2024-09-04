import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ComorbiditiesService } from './comorbidities.service';
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('comorbidities')
@ApiBearerAuth()
@Controller('comorbidities')
export class ComorbiditiesController {
  constructor(private readonly comorbiditiesService: ComorbiditiesService) {}
  
  @ApiOperation({ summary: 'cria uma nova comorbidade' })
  @Post()
  async create(@Body() createComorbidityDto: CreateComorbidityDto) {
    return await this.comorbiditiesService.create(createComorbidityDto);
  }

  @ApiOperation({ summary: 'lista todas as comorbidades' })
  @Get()
  async findAll() {
    return await this.comorbiditiesService.findAll();
  }
  
  @ApiOperation({ summary: 'retorna uma comorbidade pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.comorbiditiesService.findOne(id);
  }

  @ApiOperation({ summary: 'retorna uma comorbidade pelo nome' })
  @Post('/search')
  async findOneByName(@Query() search: CreateComorbidityDto) {
    return await this.comorbiditiesService.findByName(search.name);
  }

  @ApiOperation({ summary: 'deleta uma comorbidade pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.comorbiditiesService.remove(id);
  }
}
