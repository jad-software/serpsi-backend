import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from '../../addresses/dto/createAddress.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
