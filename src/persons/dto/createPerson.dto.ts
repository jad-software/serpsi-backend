import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { IPerson } from '../interfaces/person.interface';
import { Cpf } from '../vo/cpf.vo';
import { Phone } from '../vo/phone.vo';
import { Type } from 'class-transformer';
import { CreateCpfDto } from './createCpf.dto';
import { CreateAddressDto } from '../../addresses/dto/createAddress.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonDto implements IPerson {
  @ApiProperty({
    type: String,
    description: 'Rg da pessoa',
    example: '12.544.143-1',
  })
  @IsNotEmpty()
  @IsString()
  rg: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Foto de perfil da pessoa',
  })
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({
    type: Date,
    description: 'Data de nascimento da pessoa',
    example: '1990-08-25',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthdate: Date;

  @ApiProperty({
    type: String,
    description: 'Nome da pessoa',
    example: 'Meu nome',
  })
  @IsNotEmpty()
  name: string;

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

  @ApiProperty({
    type: Cpf,
    description: 'Cpf da pessoa',
    example: {
      cpf: '423.693.123-13',
    },
  })
  @ValidateNested()
  @Type(() => CreateCpfDto)
  cpf: Cpf;

  @ApiPropertyOptional({
    type: String,
    description: 'Id do User ao qual a Pessoa Pertence',
    example: '198aa036-dc41-4e86-a802-53e6be4d73a5',
  })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({
    type: CreateAddressDto,
    description: 'Endereço da Pessoa'})
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
