export enum Day {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
}

export function numberToDay(day: number): Day {
  switch (day) {
    case 1:
      return Day.SEGUNDA;
    case 2:
      return Day.TERCA;
    case 3:
      return Day.QUARTA;
    case 4:
      return Day.QUINTA;
    case 5:
      return Day.SEXTA;
    case 6:
      return Day.SABADO;
    case 7:
      return Day.DOMINGO;
    default:
      throw new Error('Invalid day number');
  }
}