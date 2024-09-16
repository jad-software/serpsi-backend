import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Id } from '../entity-base/vo/id.vo';
import { SchoolService } from './school.service';
import { School } from './entities/school.entity';
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import { ComorbiditiesService } from './comorbidities.service';
import { Comorbidity } from './entities/comorbidity.entity';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { MedicamentInfoService } from './medicament-info.service';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(data_providers.PATIENT_REPOSITORY)
    private patientRepository: Repository<Patient>,
    private readonly schoolService: SchoolService,
    private readonly comorbiditiesService: ComorbiditiesService,
    private readonly medicamentInfoService: MedicamentInfoService
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const patient = this.patientRepository.create(
        new Patient({ ...createPatientDto, medicines: [] })
      );
      let school = await this.setSchool(createPatientDto);
      let comorbidities: Comorbidity[] =
        await this.setComorbities(createPatientDto);

      patient.school = school;
      patient.comorbidities = comorbidities;
      let savedPatient = await this.patientRepository.save(patient);

      let medicines = await this.setMedicines(
        createPatientDto.medicines,
        savedPatient
      );
      savedPatient.medicines = medicines;

      return savedPatient;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private async setSchool(createPatientDto: CreatePatientDto) {
    let school = await this.schoolService.findOneBy(createPatientDto.school);
    if (!school)
      school = await this.schoolService.create(createPatientDto.school);
    return school;
  }

  private async setMedicines(
    medicinesDto: CreateMedicamentInfoDto[],
    patient: Patient
  ) {
    let medicines: MedicamentInfo[] = [];
    for (let medicamentDto of medicinesDto) {
      let medicament = await this.medicamentInfoService.create(
        medicamentDto,
        patient
      );
      medicament.patient = undefined;
      medicines.push(medicament);
    }
    return medicines;
  }

  private async setComorbities(createPatientDto: CreatePatientDto) {
    let comorbidities: Comorbidity[] = [];
    for (let comorbidityDto of createPatientDto.comorbidities) {
      let comorbidityEntity = (
        await this.comorbiditiesService.findByName(comorbidityDto.name)
      ).at(0);
      if (!comorbidityEntity)
        comorbidityEntity =
          await this.comorbiditiesService.create(comorbidityDto);
      comorbidities.push(comorbidityEntity);
    }
    return comorbidities;
  }

  async findAll() {
    return await this.patientRepository.find({
      relations: ['_school', '_comorbidities'],
    });
  }

  async findOne(id: string) {
    try {
      let patient = await this.patientRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient._school', '_school')
        .leftJoinAndSelect('patient._comorbidities', '_comorbidities')
        .where('patient.id = :id', { id })
        .getOneOrFail();

      patient.medicines = await this.medicamentInfoService.findAllToPatient(
        patient.id.id
      );
      return patient;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    let updatingPatient = new Patient(updatePatientDto);

    try {
      await this.patientRepository.update(id, updatingPatient);
      let patient = await this.findOne(id);
      return patient;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    return await this.patientRepository.delete(id);
  }
}
