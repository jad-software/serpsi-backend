import { CreatePersonDto } from '../../persons/dto/createPerson.dto';
import { CreateComorbidityDto } from '../dto/comorbities/create-comorbidity.dto';
import { CreateMedicamentInfoDto } from '../dto/medicine/create-medicament-info.dto';
import { CreateSchoolDto } from '../dto/school/create-school.dto';
import { Comorbidity } from '../entities/comorbidity.entity';
import { MedicamentInfo } from '../entities/medicament-info.entity';
import { School } from '../entities/school.entity';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { Person } from '../../persons/entities/person.enitiy';
import { CreateParentsDto } from '../../persons/dto/createParents.dto';

export interface IPatient {
  paymentPlan: PaymentPlan;
  school: CreateSchoolDto | School;
  comorbidities: CreateComorbidityDto[] | Comorbidity[];
  medicines: CreateMedicamentInfoDto[] | MedicamentInfo[];
  person: CreatePersonDto | Person;
  parents: CreateParentsDto[] | Person[];
}
