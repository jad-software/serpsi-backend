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
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { BillType } from '../domain/vo/bill-type.enum';


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

  async createWithMeeting(meeting: Meeting, dueDate?: Date) {
    const psychologist = await this.psychologistsService.findOne(meeting.psychologist.id.id);
    const bill = new Bill({
      amount: psychologist.meetValue,
      title: meeting.patient.person.name,
      billType: BillType.to_receive,
      dueDate: dueDate ?? meeting.schedule
    });
    bill.user = psychologist.user;
    bill.meeting = meeting;
    console.log(bill)
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
