import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './createPerson.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from '../../addresses/dto/updateAddress.dto';
export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['address'] as const)
) {
  @ApiPropertyOptional({
    type: UpdateAddressDto,
    description: 'Endereço da Pessoa',
    example: {
      "state": "RJ",
      "complement": "Sei lá"
    }
  })
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;
}
