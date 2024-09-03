import { EntityBase } from '../../entity-base/entities/entity-base';
import { Column, Entity, OneToMany } from 'typeorm';
import { CreateMedicineDto } from '../dto/create-medicine.dto';
import { Patient } from './patient.entity';
import { PatientToMedicine } from './patientToMedicine.entity';

//@Entity()
export class Medicine extends EntityBase {
  constructor(partial: Partial<CreateMedicineDto>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'name', unique: true })
  private _name: string;

  @OneToMany(
    () => PatientToMedicine,
    (patientToMedicine) => patientToMedicine.medicine
  )
  private _patients: PatientToMedicine[];

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get patients(): Patient[] {
    return this.patients;
  }

  set patients(patients: Patient[]) {
    this.patients = patients;
  }
}
