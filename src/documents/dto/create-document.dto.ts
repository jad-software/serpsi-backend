import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IDocument } from '../interfaces/document.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto implements IDocument {
  @ApiProperty({
    type: String,
    description: 'título do documento',
    example: 'título de documento',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  docLink?: string;

  @ApiProperty({
    type: String,
    description: 'Id do paciente no relacionamento com documento',
    example: '220fb404-4bf2-47c8-a20f-210f6e811620',
  })
  @IsUUID()
  @IsNotEmpty()
  patient: string;
}
