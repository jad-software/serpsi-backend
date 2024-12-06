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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('comorbidities')
export class ComorbiditiesController {
  constructor(private readonly comorbiditiesService: ComorbiditiesService) {}

  @ApiOperation({ summary: 'retorna uma comorbidade pelo nome' })
  @Post('/search')
  async findOneByName(@Query() search: CreateComorbidityDto) {
    return await this.comorbiditiesService.findByName(search.name);
  }
}
