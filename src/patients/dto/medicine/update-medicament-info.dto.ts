import { PartialType } from '@nestjs/swagger';
import { CreateMedicamentInfoDto } from './create-medicament-info.dto';

export class UpdateMedicamentInfoDto extends PartialType(
  CreateMedicamentInfoDto
) {}
