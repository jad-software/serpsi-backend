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
}
