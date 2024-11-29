import { Inject, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Repository } from 'typeorm';
import { Bill } from '../domain/entities/bill.entity';
import { data_providers } from 'src/constants';
import create from '../application/create/create';
import { GetBillsFromPsi } from '../application/getBillsFromPsi/getBillsFromPsi';
import { Delete } from '../application/delete/delete';
import { GetOne } from '../application/getOne/getOne';
import { Update } from '../application/update/update';

@Injectable()
export class BillsService {
  constructor(
    @Inject(data_providers.BILLS_REPOSITORY)
    private readonly BillRepository: Repository<Bill>
  ) { }
  async create(createBillDto: CreateBillDto) {
    return await create(createBillDto, this.BillRepository);
  }

  async findAll(psychologis_id: string) {
    return await GetBillsFromPsi(psychologis_id, this.BillRepository);
  }

  async findOne(id: string) {
    return await GetOne(id, this.BillRepository);
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    return await Update(id, updateBillDto, this.BillRepository);
  }

  async remove(id: string) {
    return await Delete(id, this.BillRepository);
  }
}
