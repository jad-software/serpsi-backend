import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './createAddress.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
