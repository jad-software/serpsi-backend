import { Id } from '../../entity-base/vo/id.vo';

export interface IDay {
  startTime: string;
  endTime: string;
  id: Id;
}

export interface GroupedAgenda {
  SEGUNDA?: IDay[];
  TERCA?: IDay[];
  QUARTA?: IDay[];
  QUINTA?: IDay[];
  SEXTA?: IDay[];
  SABADO?: IDay[];
  DOMINGO?: IDay[];
}
