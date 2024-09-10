import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './createPerson.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from './updateAddress.dto';
export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['address'] as const)
) {
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;
}
