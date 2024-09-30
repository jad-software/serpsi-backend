import { Column, Entity } from 'typeorm';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Crp } from '../vo/crp.vo';

@Entity()
export class Psychologist extends EntityBase {
  @Column(() => Crp, {
    prefix: false,
  })
  private _crp: Crp;

  @Column({ name: 'identifyLink' })
  private _identifyLink: string;

  @Column({ name: 'degreeLink' })
  private _degreeLink: string;

  get crp(): Crp {
    return this._crp;
  }

  set crp(crp: Crp) {
    this._crp = crp;
  }

  get identifyLink(): string {
    return this._identifyLink;
  }

  set identifyLink(identifyLink) {
    this._identifyLink = identifyLink;
  }

  get degreeLink(): string {
    return this._degreeLink;
  }

  set degreeLink(degreeLink) {
    this._degreeLink = degreeLink;
  }
}
