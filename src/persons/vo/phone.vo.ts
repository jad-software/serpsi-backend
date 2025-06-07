import { Column } from 'typeorm';

export class Phone {
  constructor(partial: Partial<Phone>) {
    Object.assign(this, partial);
  }
  @Column({ default: '+55', name: 'ddi', nullable: true })
  private _ddi?: string;

  @Column({ name: 'ddd', nullable: true })
  private _ddd?: string;

  @Column({ name: 'number', nullable: true })
  private _number?: string;

  get ddi(): string {
    return this._ddi;
  }
  set ddi(ddi: string) {
    this._ddi = ddi;
  }

  get ddd(): string {
    return this._ddd;
  }
  set ddd(ddd: string) {
    this._ddd = ddd;
  }

  get number(): string {
    return this._number;
  }
  set number(number: string) {
    this._number = number;
  }
}
