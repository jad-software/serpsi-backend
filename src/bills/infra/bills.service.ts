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
import { PsychologistsService } from 'src/psychologists/psychologists.service';
import { MeetingsService } from 'src/meetings/infra/meetings.service';


@Injectable()
export class BillsService {
  constructor(
    @Inject(data_providers.BILLS_REPOSITORY)
    private readonly BillRepository: Repository<Bill>,
    private readonly psychologistsService: PsychologistsService,
    private readonly meetingsService: MeetingsService
  ) { }
  async create(createBillDto: CreateBillDto) {
    const psychologist = await this.psychologistsService.findOne(createBillDto.psychologist_id);
    console.log(psychologist.user);
    const bill = new Bill(createBillDto);
    bill.user = psychologist.user;
    return await create(bill, this.BillRepository);
  }

  async findAll(psychologist_id: string) {
    const psychologist = await this.psychologistsService.findOne(psychologist_id);
    return await GetBillsFromPsi(psychologist.user.id.id, this.BillRepository);
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
