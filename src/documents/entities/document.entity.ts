import { Column, Entity } from 'typeorm';
import { IDocument } from '../interfaces/document.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { EntityBase } from 'src/entity-base/entities/entity-base';

@Entity()
export class Document extends EntityBase implements IDocument {
  constructor(partial: Partial<CreateDocumentDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'title' })
  private _title: string;

  @Column({ name: 'docLink' })
  private _docLink: string;

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
  }

  get docLink(): string {
    return this._docLink;
  }
  set docLink(docLink: string) {
    this._docLink = docLink;
  }
}
