import { Column } from 'typeorm';

export class Crp {
  constructor(partial: Partial<Crp>) {
    Object.assign(this, partial);
  }

  @Column({
    unique: true,
    name: 'crp',
  })
  private _crp: string;

  @Column({
    name: 'crpLink',
  })
  private _crpLink: string;

  get crp(): string {
    return this._crp;
  }

  set crp(crp: string) {
    this._crp = crp;
  }

  get crpLink(): string {
    return this._crpLink;
  }

  set crpLink(crpLink: string) {
    this._crpLink = crpLink;
  }
}
