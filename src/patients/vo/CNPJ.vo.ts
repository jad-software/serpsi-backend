import { Column } from 'typeorm';

export class CNPJ {
  @Column({ unique: true, name: 'CNPJ' })
  private _code: string;

  constructor(code: string) {
    this._code = code;
  }

  get code(): string {
    return this._code;
  }

  set email(code: string) {
    this._code = code;
  }
}
