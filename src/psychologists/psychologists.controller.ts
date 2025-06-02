import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePassworDto } from './dto/change-password.dto';
import { Public } from 'src/constants';
import { LocalAuthGuard } from 'src/auth/guards/local.guards';

@ApiTags('psychologists')
@ApiBearerAuth()
@Controller('psychologists')
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  @ApiOperation({ summary: 'Lista todos os psicólogos' })
  @Get()
  async findAll() {
    return await this.psychologistsService.findAll();
  }

  @ApiOperation({ summary: 'Lista um psicólogo pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.psychologistsService.findOne(id);
  }

  @ApiOperation({ summary: 'atualiza um psicólogo pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto
  ) {
    return await this.psychologistsService.update(id, updatePsychologistDto);
  }

  @ApiOperation({ summary: 'deleta um psicólogo pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.psychologistsService.remove(id);
  }

  @ApiOperation({ summary: 'Atualiza a senha de um psicólogo' })
  @Patch('/updatePassword/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() changePassword: ChangePassworDto
  ) {
    return await this.psychologistsService.updatePassword(id, changePassword);
  }
}
