import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { User } from 'src/auth/providers/user.decorator';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto) {
    return await this.billsService.create(createBillDto);
  }

  @Get()
  async findAll(@User() userInfo) {
    return await this.billsService.findAll(userInfo.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.billsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return await this.billsService.update(id, updateBillDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.billsService.remove(id);
  }
}
