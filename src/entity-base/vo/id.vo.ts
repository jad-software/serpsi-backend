import { PrimaryGeneratedColumn } from 'typeorm';

export class Id {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  public equals(id: Id): boolean {
    return this._id === id.id;
  }

  get id(): string {
    return this._id;
  }
  set id(val: string) {
    this._id = val;
  }
}
