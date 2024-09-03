import { CreateSchoolDto } from '../dto/create-school.dto';
import { School } from '../entities/school.entity';
import { PaymentPlan } from '../vo/PaymentPlan.enum';

export interface IPatient {
  paymentPlan: PaymentPlan;
  school: CreateSchoolDto | School;
}
