import { IsNotEmpty, Matches } from "class-validator";

export class CreateCpfDto {
  @IsNotEmpty()
  @Matches(
    new RegExp(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
    {
      message: 'Cpf Inválido',
    }
  )
  cpf: string;
}