import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Crp } from '../vo/crp.vo';
import { CreatePsychologistDto } from '../dto/create-psychologist.dto';
import { User } from '../../users/entities/user.entity';

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
