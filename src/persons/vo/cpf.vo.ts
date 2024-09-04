export class Cpf {
  constructor(cpf: string) {
    this._cpf = cpf;
  }

  private _cpf: string;
  
  get cpf(): string {
    return this._cpf;
  }

  set cpf(cpf: string) {
    this._cpf = cpf;
  }
}
