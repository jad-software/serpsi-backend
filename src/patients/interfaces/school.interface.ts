import { CNPJ } from '../vo/CNPJ.vo';

export interface ISchool {
  name: string;
  CNPJ: CNPJ | string;
}
