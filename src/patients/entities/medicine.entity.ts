import { EntityBase } from '../../entity-base/entities/entity-base';
import { Column, Entity, OneToMany } from 'typeorm';
import { CreateMedicineDto } from '../dto/create-medicine.dto';
import { Patient } from './patient.entity';
import { MedicamentInfo } from './medicamentInfo.entity';

//@Entity()
export class Medicine extends EntityBase {
  constructor(partial: Partial<CreateMedicineDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'name', unique: true })
  private _name: string;

  @OneToMany(
    () => MedicamentInfo,
    (medicamentInfo) => medicamentInfo.medicine
  )
  private _patients: MedicamentInfo[];

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get patients(): MedicamentInfo[] {
    return this._patients;
  }

  set patients(patients: MedicamentInfo[]) {
    this._patients = patients;
  }
}
