import { OmitType } from "@nestjs/swagger";
import { CreatePersonDto } from "./createPerson.dto";

export class CreateParentsDto extends OmitType(CreatePersonDto, ['user', 'address', 'profilePicture'] as const) {}