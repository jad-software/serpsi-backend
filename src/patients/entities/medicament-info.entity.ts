import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { Medicine } from './medicine.entity';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { CreateMedicamentInfoDto } from '../dto/medicine/create-medicament-info.dto';
import { Id } from 'src/entity-base/vo/id.vo';

@Entity()
export class MedicamentInfo extends EntityBase {
  constructor(partial: Partial<CreateMedicamentInfoDto>) {
    super();
    if (partial) {
      Object.assign(this, partial);
      if(partial.dosage){
        this.dosage = partial.dosage.toString();
      }
      
      if (partial.dosage && partial.dosageUnity) {
        this.dosage = `${partial.dosage} ${partial.dosageUnity}`;
      }

      if (partial.frequency && partial.firstTimeOfTheDay) {
        this.firstTimeOfTheDay = new Date(partial.firstTimeOfTheDay);
        this.generateSchedules();
      }
    }
  }
  @Column({ name: 'dosage' })
  private _dosage: string;

  @Column({ name: 'frequency' })
  private _frequency: number;

  @Column({ name: 'firstTimeOfTheDay' })
  private _firstTimeOfTheDay: Date;

  @Column({ name: 'StartDate' })
  private _startDate: Date;

  @Column({ name: 'observation' })
  private _observation?: string;

  private _schedules: Date[];

  @ManyToOne(() => Patient, (patient) => patient.medicines)
  private _patient: Patient;

  @ManyToOne(() => Medicine, (medicine) => medicine.patients, {
    eager: true,
  })
  private _medicine: Medicine;

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
  get dosage(): string {
    return this._dosage;
  }
  set dosage(dosage: string) {
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
