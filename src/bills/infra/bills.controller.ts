import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { User } from 'src/auth/providers/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bills')
@ApiBearerAuth()
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @ApiOperation({ summary: 'Criar uma conta com o id ou da reunião ou do psicólogo' })
  @Post()
  async create(@Body() createBillDto: CreateBillDto) {
    return await this.billsService.create(createBillDto);
  }
  @ApiOperation({ summary: 'Lista todas as contas do psicólogo logado' })
  @Get()
  async findAll(@User() userInfo) {
    return await this.billsService.findAll(userInfo.id);
  }

  @ApiOperation({ summary: 'retorna uma conta pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.billsService.findOne(id);
  }

  @ApiOperation({ summary: 'atualiza uma conta pelo id' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return await this.billsService.update(id, updateBillDto);
  }

  @ApiOperation({ summary: 'deleta uma conta pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.billsService.remove(id);
  }
}
