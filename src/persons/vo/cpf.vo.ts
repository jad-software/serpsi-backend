import { Column } from 'typeorm';

export class Cpf {
  constructor(cpf: string) {
    this._cpf = cpf;
  }

  @Column({
    name: 'cpf',
  })
  private _cpf: string;

  get cpf(): string {
    return this._cpf;
  }

  set cpf(cpf: string) {
    this._cpf = cpf;
  }
}
