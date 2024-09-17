import { EntityBase } from '../../entity-base/entities/entity-base';
import { Column, Entity } from 'typeorm';
import { CreateComorbidityDto } from '../dto/comorbities/create-comorbidity.dto';

@Entity()
export class Comorbidity extends EntityBase {
  constructor(partial: Partial<CreateComorbidityDto>) {
    super();
    Object.assign(this, partial);
  }
  @Column({ name: 'name', unique: true })
  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
