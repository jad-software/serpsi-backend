import { IsNotEmpty, Matches } from "class-validator";

export class CreateCrpDto {
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{6}$/, {
    message: 'CRP Inválido',
  })
  crp: string;
}
