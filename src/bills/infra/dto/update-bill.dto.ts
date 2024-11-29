import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';

export class UpdateBillDto extends PartialType(OmitType(CreateBillDto, ["psychologist_id"] as const)) {}
