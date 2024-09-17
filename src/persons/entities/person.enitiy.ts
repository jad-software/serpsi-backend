import { Address } from './../../addresses/entities/address.entity';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { CreatePersonDto } from '../dto/createPerson.dto';
import { Phone } from '../vo/phone.vo';
import { Cpf } from '../vo/cpf.vo';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IPerson } from '../interfaces/person.interface';
import { UpdatePersonDto } from '../dto/updatePerson.dto';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Person extends EntityBase implements IPerson {
  constructor(partial: Partial<CreatePersonDto | UpdatePersonDto>) {
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

  @ManyToOne(() => Address, (address) => address.persons)
  address: Address;

  @OneToOne(() => User, (user) => user.person, { nullable: true })
  @JoinColumn()
  user: User;

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
