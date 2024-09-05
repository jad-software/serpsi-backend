import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { IAddress } from '../interfaces/address.interface';

export class CreateAddressDto implements IAddress {
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNumber()
  @Min(0)
  homeNumber: number;

  @IsNotEmpty()
  @IsString()
  complement: string;
}
