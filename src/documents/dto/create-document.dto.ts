import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IDocument } from '../interfaces/document.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto implements IDocument {
  @ApiProperty({
    type: String,
    description: 'título do documento',
    example: 'relato de sessão',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  docLink?: string;

  @ApiProperty({
    type: String,
    description: 'Id da sessão no relacionamento com documento',
    example: 'meeting_id',
  })
  @IsUUID()
  @IsNotEmpty()
  meeting: string;
}
