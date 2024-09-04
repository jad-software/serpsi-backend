import { EntityBase } from "src/entity-base/entities/entity-base";
import { CreatePersonDto } from '../dto/createPerson.dto';
import { Phone } from "../vo/phone.vo";
import { Cpf } from "../vo/cpf.vo";

export class Person extends EntityBase {
  constructor(partial: Partial<CreatePersonDto>){
    super();
    Object.assign(this, partial);
  }
  private _name: string;

  private _rg: string;

  private _profilePicture: string;

  private _birthdate: Date;

  private _phone: Phone;

  private _cpf: Cpf;

  get name() : string {
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
  
  get profilePicture() : string {
    return this._profilePicture;
  }
  set profilePicture(profilePicture: string) {
    this._profilePicture = profilePicture;
  }

  get birthdate() : Date {
    return this._birthdate;
  }

  set birthdate(birthdate: Date) {
    this.birthdate = birthdate;
  }

  get phone(): Phone{
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
