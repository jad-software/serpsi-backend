import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './createPerson.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
