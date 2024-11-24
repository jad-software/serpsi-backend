import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IAddress } from '../interfaces/address.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto implements IAddress {
  @ApiProperty({
    type: String,
    description: 'CEP do endereço da pessoa',
    example: '41796616',
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({
    type: String,
    description: 'Rua do endereço da pessoa',
    example: 'Rua da pessoa teste Swagger',
  })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({
    type: String,
    description: 'Bairro do endereço da pessoa',
    example: 'Centro',
  })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({
    type: String,
    description: 'Cidade do endereço da pessoa',
    example: 'Salvador',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    type: String,
    description: 'Estado do endereço da pessoa',
    example: 'BA',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    type: String,
    description: 'Numero da casa da pessoa',
    example: '94c',
  })
  @IsString()
  homeNumber: string;

  @ApiProperty({
    type: String,
    description: 'Complemento do endereço da pessoa',
    example: 'Tô sem ideia do que colocar',
  })
  @IsOptional()
  @IsString()
  complement?: string;
}
