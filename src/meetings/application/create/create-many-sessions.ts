import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { FrequencyEnum } from '../../../meetings/infra/dto/frequency.enum';
import { Repository } from 'typeorm';
import { create } from './create';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { BillsService } from 'src/bills/infra/bills.service';
import { PaymentPlan } from 'src/patients/vo/PaymentPlan.enum';
import { formatDate } from 'src/helpers/format-date';

export async function createManySessions(data: { meeting: Meeting, frequency: FrequencyEnum, quantity: number, amount?: number }, service: { repository: Repository<Meeting>, billsService: BillsService }) {
  let dueDate = modifyDueDate(new Date(data.meeting.schedule), data.meeting.patient.paymentPlan);
  console.log(data.meeting.patient.paymentPlan)
  const conflicts: string[] = [];
  const sessions: Meeting[] = [];
  for (let i = 0; i < data.quantity; i++) {
    const date = new Date(data.meeting.schedule);
    date.setDate(date.getDate() + (data.frequency * i * 7));

    if (date >= dueDate) {
      dueDate = modifyDueDate(new Date(date), data.meeting.patient.paymentPlan);
    }

    const meeting: Meeting = new Meeting({
      ...data.meeting,
      schedule: date,
    })

    const session = await create({ meeting, dueDate, amount:data.amount }, service, true)

    if (session.status === StatusType.CREDIT)
      conflicts.push(`${formatDate(meeting.schedule)}`);
    else {
      sessions.push(session);
    }
  }
  if (sessions.length === 0) {
    throw new BadRequestException(
      'problemas ao criar sessões'
    );
  }
  return {
    sessions,
    conflicts
  }
}


function modifyDueDate(dueDate: Date, paymentPlan: PaymentPlan): Date {
  const daysToAdd = {
    [PaymentPlan.AVULSA]: 1,
    [PaymentPlan.MENSAL]: 28, // 4 * 7
    [PaymentPlan.BIMESTRAL]: 56, // 8 * 7 
    [PaymentPlan.TRIMESTRAL]: 84 // 12 * 7
  };

  const dateNumber = dueDate.getDate() + (daysToAdd[paymentPlan] || 0);
  dueDate.setDate(dateNumber);
  return dueDate;
}
