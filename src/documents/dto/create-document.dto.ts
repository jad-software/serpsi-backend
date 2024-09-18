import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IDocument } from '../interfaces/document.interface';

export class CreateDocumentDto implements IDocument {
  @IsNotEmpty()
  @IsString()
  title: string;


  docLink?: string;

  @IsUUID()
  @IsNotEmpty()
  patient: string;
}
