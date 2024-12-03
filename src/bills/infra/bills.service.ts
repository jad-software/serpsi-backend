import { Inject, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Repository } from 'typeorm';
import { Bill } from '../domain/entities/bill.entity';
import { data_providers } from '../../constants';
import create from '../application/create/create';
import { GetBillsFromPsi } from '../application/getBillsFromPsi/getBillsFromPsi';
import { Delete } from '../application/delete/delete';
import { GetOne } from '../application/getOne/getOne';
import { Update } from '../application/update/update';
import { PsychologistsService } from '../../psychologists/psychologists.service';
import { Meeting } from '../../meetings/domain/entities/meeting.entity';
import { BillType } from '../domain/vo/bill-type.enum';
import { UpdateMany } from '../application/updateMany/updatemany';
import { UpdatePaymentManyDto } from './dto/update-payment-many.dto';


@Injectable()
export class BillsService {
  constructor(
    @Inject(data_providers.BILLS_REPOSITORY)
    private readonly BillRepository: Repository<Bill>,
    private readonly psychologistsService: PsychologistsService
  ) { }
  async create(createBillDto: CreateBillDto) {
    const psychologist = await this.psychologistsService.findOne(createBillDto.psychologist_id);
    const bill = new Bill(createBillDto);
    bill.user = psychologist.user;
    return await create(bill, this.BillRepository);
  }

  async createWithMeeting(meeting: Meeting, dueDate?: Date, amount?: number) {
    const psychologist = await this.psychologistsService.findOne(meeting.psychologist.id.id);
    const bill = new Bill({
      amount: amount ?? psychologist.meetValue,
      title: meeting.patient.person.name,
      billType: BillType.to_receive,
      dueDate: dueDate ?? meeting.schedule
    });
    bill.user = psychologist.user;
    bill.meeting = meeting;
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
  
  async updateMany(updateBillDto: UpdatePaymentManyDto) {
    return await UpdateMany(updateBillDto, this.BillRepository);
  }

  async remove(id: string) {
    return await Delete(id, this.BillRepository);
  }
}
