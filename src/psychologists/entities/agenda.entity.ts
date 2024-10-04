import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Day } from '../vo/days.enum';
import { IAgenda } from '../interfaces/agenda.interface';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { Psychologist } from './psychologist.entity';

@Entity()
export class Agenda extends EntityBase implements IAgenda {
  constructor(partial: Partial<Agenda>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    name: 'day',
    enum: Day,
    default: Day.SEGUNDA,
  })
  private _day: Day;

  @Column({ name: 'startTime', type: 'time' })
  private _startTime: string;

  @Column({ name: 'endTime', type: 'time' })
  private _endTime: string;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.agendas)
  psychologist: Psychologist;

  get day(): Day {
    return this._day;
  }

  set day(day: Day) {
    this._day = day;
  }

  get startTime(): string {
    return this._startTime;
  }

  set startTime(startTime: string) {
    this._startTime = startTime;
  }

  get endTime(): string {
    return this._endTime;
  }

  set endTime(endTime: string) {
    this._endTime = endTime;
  }
}
