import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { ISchool } from '../../interfaces/school.interface';
import { ApiProperty } from '@nestjs/swagger';
import { CNPJ } from '../../../constants';
import { Transform, Type } from 'class-transformer';
import { Address } from '../../../addresses/entities/address.entity';
import { Phone } from '../../../persons/vo/phone.vo';
import { CreateAddressDto } from '../../../addresses/dto/createAddress.dto';

export class CreateSchoolDto implements ISchool {
  @ApiProperty({
    type: String,
    description: 'nome da escola',
    example: 'ativa idade',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'CNPJ da escola',
    example: '00.000.000/0001-00',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(RegExp(CNPJ.REGEX), { message: 'CNPJ inválido' })
  CNPJ: string;

  @ApiProperty({
    type: CreateAddressDto,
    description: 'Endereço da escola',
    example: {
      state: 'BA',
      zipCode: '4499815760',
      street: 'rua dos bobos',
      district: 'bairro bonito',
      city: 'cidade que ficou faltando',
      homeNumber: 1131,
      complement: 'complemento',
    },
  })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: Address;

  @ApiProperty({
    type: Phone,
    description: 'Telefone da pessoa',
    example: {
      ddi: '+55',
      ddd: '71',
      number: '998085317',
    },
  })
  @IsNotEmpty()
  phone: Phone;
}
