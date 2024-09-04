import { EntityBase } from 'src/entity-base/entities/entity-base';
import { CreatePersonDto } from '../dto/createPerson.dto';
import { Phone } from '../vo/phone.vo';
import { Cpf } from '../vo/cpf.vo';
import { Column, Entity } from 'typeorm';

@Entity()
export class Person extends EntityBase {
  constructor(partial: Partial<CreatePersonDto>) {
    super();
    Object.assign(this, partial);
  }
  @Column({ name: 'name' })
  private _name: string;

  @Column({ name: 'rg', unique: true })
  private _rg: string;

  @Column({ name: 'profilePicture' })
  private _profilePicture: string;

  @Column({ name: 'birthdate' })
  private _birthdate: Date;

  @Column(() => Phone, {
    prefix: false,
  })
  private _phone: Phone;

  @Column(() => Cpf, {
    prefix: false,
  })
  private _cpf: Cpf;

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
  get rg(): string {
    return this._rg;
  }
  set rg(rg: string) {
    this._rg = rg;
  }

  get profilePicture(): string {
    return this._profilePicture;
  }
  set profilePicture(profilePicture: string) {
    this._profilePicture = profilePicture;
  }

  get birthdate(): Date {
    return this._birthdate;
  }

  set birthdate(birthdate: Date) {
    this._birthdate = birthdate;
  }

  get phone(): Phone {
    return this._phone;
  }

  set phone(phone: Phone) {
    this._phone = phone;
  }

  get cpf(): Cpf {
    return this._cpf;
  }

  set cpf(cpf: Cpf) {
    this._cpf = cpf;
  }
}
