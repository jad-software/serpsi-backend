import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Crp } from '../vo/crp.vo';
import { CreatePsychologistDto } from '../dto/create-psychologist.dto';
import { User } from '../../users/entities/user.entity';
import { Agenda } from './agenda.entity';

@Entity()
export class Psychologist extends EntityBase {
  constructor(partial: Partial<Psychologist>) {
    super();
    Object.assign(this, partial);
  }

  @Column(() => Crp, {
    prefix: false,
  })
  private _crp: Crp;

  @Column({ name: 'identifyLink' })
  private _identifyLink: string;

  @Column({ name: 'degreeLink' })
  private _degreeLink: string;

  @Column('decimal', { default: 0, name: 'meetValue' })
  private _meetValue: number;

  @Column({ default: 0, name: 'meetDuration' })
  private _meetDuration: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Agenda, (agenda) => agenda.psychologist)
  agendas: Agenda[];

  get crp(): Crp {
    return this._crp;
  }

  set crp(crp: Crp) {
    this._crp = crp;
  }

  get identifyLink(): string {
    return this._identifyLink;
  }

  set identifyLink(identifyLink: string) {
    this._identifyLink = identifyLink;
  }

  get degreeLink(): string {
    return this._degreeLink;
  }

  set degreeLink(degreeLink: string) {
    this._degreeLink = degreeLink;
  }

  get meetValue(): number {
    return this._meetValue;
  }

  set meetValue(meetValue: number) {
    this._meetValue = meetValue;
  }

  get meetDuration(): number {
    return this._meetDuration;
  }

  set meetDuration(meetDuration: number) {
    this._meetDuration = meetDuration;
  }
}
