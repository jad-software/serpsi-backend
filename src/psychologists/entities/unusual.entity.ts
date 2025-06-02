import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Psychologist } from './psychologist.entity';
import { IUnusual } from '../interfaces/unusual.interface';

@Entity()
export class Unusual extends EntityBase implements IUnusual {
  constructor(partial: Partial<Unusual>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'timestamptz', name: 'date' })
  private _date: Date;

  @Column({ name: 'startTime', type: 'time' })
  private _startTime: string;

  @Column({ name: 'endTime', type: 'time' })
  private _endTime: string;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.agendas, {
    onDelete: 'CASCADE',
  })
  psychologist: Psychologist;

  get date(): Date {
    return this._date;
  }

  set date(day: Date) {
    this._date = day;
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
