import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreatePersonDto } from '../../persons/dto/createPerson.dto';
import { Crp } from '../vo/crp.vo';

export class CreatePsychologistDto {
  crp: Crp;
  identifyLink: string;
  degreeLink: string;
  person: CreatePersonDto;
  user: CreateUserDto;
}
