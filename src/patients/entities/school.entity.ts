import { EntityBase } from '../../entity-base/entities/entity-base';
import { ISchool } from '../interfaces/school.interface';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class School extends EntityBase implements ISchool {
  constructor(data: Partial<CreateSchoolDto>) {
    super();
    Object.assign(this, data);
  }
  @Index()
  @Column({ unique: true, name: 'name' })
  private _name: string;

  @Column({ unique: true, name: 'CNPJ' })
  private _CNPJ: string;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get CNPJ(): string {
    return this._CNPJ;
  }
  set CNPJ(value: string) {
    this._CNPJ = value;
  }
}
