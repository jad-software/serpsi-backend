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
  const dayMap: Record<number, Day> = {
    1: Day.SEGUNDA,
    2: Day.TERCA,
    3: Day.QUARTA,
    4: Day.QUINTA,
    5: Day.SEXTA,
    6: Day.SABADO,
    7: Day.DOMINGO
  };

  if (!(day in dayMap)) {
    throw new Error('Invalid day number');
  }

  return dayMap[day];
}
