import { Column } from 'typeorm';

export class Crp {
  constructor(crp: string, crpLink: string) {
    this._crp = crp;
    this._crpLink = crpLink;
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

  get crpFileLink(): string {
    return this._crpLink;
  }

  set crpFileLink(crpLink) {
    this._crpLink = crpLink;
  }
}
