import { Column, Entity, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { Medicine } from './medicine.entity';
import { EntityBase } from '../../entity-base/entities/entity-base';

//@Entity()
export class MedicamentInfo extends EntityBase {
  @Column({ name: 'patientId' })
  private _patientId: string;

  @Column({ name: 'medicineId' })
  private _medicineId: string;

  @ManyToOne(() => Patient, (patient) => patient.medicines)
  private _patient: Patient;

  @ManyToOne(() => Medicine, (medicine) => medicine.patients, {
    eager: true,
  })
  private _medicine: Medicine;

  get patientId(): string {
    return this._patientId;
  }
  set patientId(patientId: string) {
    this._patientId = patientId;
  }
  get medicineId(): string {
    return this._medicineId;
  }
  set medicineId(medicineId: string) {
    this._medicineId = medicineId;
  }
  get patient(): Patient {
    return this._patient;
  }
  set patient(patient: Patient) {
    this._patient = patient;
  }
  get medicine(): Medicine {
    return this._medicine;
  }
  set medicine(medicine: Medicine) {
    this._medicine = medicine;
  }
}
