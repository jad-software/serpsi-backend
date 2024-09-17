import { EntityBase } from '../../entity-base/entities/entity-base';
import { Column, Entity, OneToMany } from 'typeorm';
import { IAddress } from '../../addresses/interfaces/address.interface';
import { CreateAddressDto } from '../dto/createAddress.dto';
import { Person } from '../../persons/entities/person.enitiy';

@Entity()
export class Address extends EntityBase implements IAddress {
  constructor(partial: Partial<CreateAddressDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'zipCode' })
  private _zipCode: string;
  @Column({ name: 'street' })
  private _street: string;
  @Column({ name: 'district' })
  private _district: string;
  @Column({ name: 'state' })
  private _state: string;
  @Column({ name: 'homeNumber' })
  private _homeNumber: number;
  @Column({ name: 'complement' })
  private _complement: string;

  @OneToMany(() => Person, (person) => person.address)
  persons: Person[];

  get zipCode(): string {
    return this._zipCode;
  }
  set zipCode(zipCode: string) {
    this._zipCode = zipCode;
  }

  get street(): string {
    return this._street;
  }
  set street(street: string) {
    this._street = street;
  }

  get district(): string {
    return this._district;
  }
  set district(district: string) {
    this._district = district;
  }

  get state(): string {
    return this._state;
  }
  set state(state: string) {
    this._state = state;
  }

  get homeNumber(): number {
    return this._homeNumber;
  }
  set homeNumber(homeNumber: number) {
    this._homeNumber = homeNumber;
  }

  get complement(): string {
    return this._complement;
  }

  set complement(complement: string) {
    this._complement = complement;
  }
}
