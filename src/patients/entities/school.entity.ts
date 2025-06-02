import { EntityBase } from '../../entity-base/entities/entity-base';
import { ISchool } from '../interfaces/school.interface';
import { CreateSchoolDto } from '../dto/school/create-school.dto';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { CNPJ } from '../vo/CNPJ.vo';
import { Address } from '../../addresses/entities/address.entity';
import { Phone } from '../../persons/vo/phone.vo';

@Entity()
export class School extends EntityBase implements ISchool {
  constructor(data: Partial<CreateSchoolDto>) {
    super();
    Object.assign(this, data);
  }

  @Index()
  @Column({ unique: true, name: 'name' })
  private _name: string;

  @Column(() => CNPJ, {
    prefix: false,
  })
  private _CNPJ: CNPJ;

  @ManyToOne(() => Address, (address) => address.persons)
  _address: Address;

  @Column(() => Phone, {
    prefix: false,
  })
  _phone: Phone;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get CNPJ(): CNPJ {
    return this._CNPJ;
  }
  set CNPJ(value: CNPJ) {
    this._CNPJ = value;
  }

  get address(): Address {
    return this._address;
  }
  set address(value: Address) {
    this._address = value;
  }

  get phone(): Phone {
    return this._phone;
  }
  set phone(value: Phone) {
    this._phone = value;
  }
}
