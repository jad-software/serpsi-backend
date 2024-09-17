import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Medicine } from './medicine.entity';
import { CreateMedicamentInfoDto } from '../dto/medicine/create-medicament-info.dto';

@Entity()
export class MedicamentInfo {
  constructor(partial: Partial<CreateMedicamentInfoDto>) {
    Object.assign(this, partial);
    if (partial) {
      if (partial.frequency && partial.firstTimeOfTheDay) {
        this.firstTimeOfTheDay = new Date(partial.firstTimeOfTheDay);
        this.generateSchedules();
      }
    }
  }

  @PrimaryColumn({ name: 'Patient_id' })
  private _patient_id: string;

  @PrimaryColumn({ name: 'Medicine_id' })
  private _medicine_id: string;

  @ManyToOne(() => Patient, (patient) => patient.medicines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Patient_id' })
  private _patient: Patient;

  @ManyToOne(() => Medicine, (medicine) => medicine.patients, {
    eager: true,
  })
  private _medicine: Medicine;

  @Column({ name: 'dosage' })
  private _dosage: number;

  @Column({ name: 'dosageUnity' })
  private _dosageUnity: string;

  @Column({ name: 'frequency' })
  private _frequency: number;

  @Column({ name: 'firstTimeOfTheDay' })
  private _firstTimeOfTheDay: Date;

  @Column({ name: 'StartDate' })
  private _startDate: Date;

  @Column({ name: 'observation' })
  private _observation?: string;

  private _schedules: Date[];

  private generateSchedules(): void {
    const schedules: Date[] = [];
    for (let i = 0; i < 24; i += 24 / this.frequency) {
      let time = new Date(
        this.firstTimeOfTheDay.getTime() + i * 60 * 60 * 1000
      );
      schedules.push(time);
    }
    this._schedules = schedules;
  }
  get dosageUnity(): string {
    return this._dosageUnity;
  }
  set dosageUnity(dosageUnity: string) {
    this._dosageUnity = dosageUnity;
  }
  get Patient_id(): string {
    return this._patient_id;
  }
  set Patient_id(patient_id: string) {
    this._patient_id = patient_id;
  }

  get Medicine_id(): string {
    return this._medicine_id;
  }
  set Medicine_id(medicine_id: string) {
    this._medicine_id = medicine_id;
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
  get dosage(): number {
    return this._dosage;
  }
  set dosage(dosage: number) {
    this._dosage = dosage;
  }
  get frequency(): number {
    return this._frequency;
  }
  set frequency(frequency: number) {
    this._frequency = frequency;
  }
  get firstTimeOfTheDay(): Date {
    return this._firstTimeOfTheDay;
  }
  set firstTimeOfTheDay(firstTimeOfTheDay: Date) {
    this._firstTimeOfTheDay = firstTimeOfTheDay;
  }
  get startDate(): Date {
    return this._startDate;
  }
  set startDate(startDate: Date) {
    this._startDate = startDate;
  }
  get observation(): string {
    return this._observation;
  }
  set observation(observation: string) {
    this._observation = observation;
  }
  get schedules(): Date[] {
    return this._schedules;
  }
}
