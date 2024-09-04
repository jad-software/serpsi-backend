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

@Injectable()
export class PatientsService {
  constructor(
    // @Inject(data_providers.PATIENT_REPOSITORY)
    //private patientRepository: Repository<Patient>,
    private readonly schoolService: SchoolService
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const school = await this.schoolService.create(createPatientDto.school);
      const patient = new Patient(createPatientDto);
      patient.school = school;
      return school;
      //return await this.patientRepository.save(patient);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    //return await this.patientRepository.find();
    return await this.schoolService.findAll();
  }

  async findOne(id: string) {
    let requestedPatient = new Patient({});
    requestedPatient.id = new Id(id);
    try {
      // return await this.patientRepository.findOneOrFail({
      //   where: { ...requestedPatient },
      // });
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
      // await this.patientRepository.update(id, updatingPatient);
      let patient = await this.findOne(id);
      return patient;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    //return await this.patientRepository.delete(id);
  }
}
