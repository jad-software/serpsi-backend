import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Id } from '../vo/id.vo';

export abstract class EntityBase {
  @Column(() => Id, { prefix: false })
  private _id: Id;

  @CreateDateColumn({ type: 'timestamptz', name: 'createDate', select: false })
  private _createDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updateDate', select: false })
  private _updateDate: Date;

  get CreateDate(): Date {
    return this._createDate;
  }

  get UpdateDate(): Date {
    return this._updateDate;
  }

  get id(): Id {
    return this._id;
  }

  set id(value: Id) {
    this._id = value;
  }
}
