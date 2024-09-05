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

@Injectable()
export class PatientsService {
  constructor(
    @Inject(data_providers.PATIENT_REPOSITORY)
    private patientRepository: Repository<Patient>,
    private readonly schoolService: SchoolService,
    private readonly comorbiditiesService: ComorbiditiesService
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = new Patient({ ...createPatientDto });
    try {
      let school = await this.schoolService.findOneBy(createPatientDto.school);
      if (!school)
        school = await this.schoolService.create(createPatientDto.school);

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
      patient.comorbidities = comorbidities;
      patient.school = school;
      return await this.patientRepository.save(patient);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient._school', 'school')
      .leftJoinAndSelect('patient._comorbidities', 'comorbidities')
      .getMany();
  }

  async findOne(id: string) {
    let requestedPatient = new Patient({});
    requestedPatient.id = new Id(id);
    try {
      return await this.patientRepository.findOneOrFail({
        where: { ...requestedPatient },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async findOneSchool(search: UpdateSchoolDto): Promise<School> {
    try {
      return await this.schoolService.findOneBy(search);
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
