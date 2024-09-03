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

@Injectable()
export class PatientsService {
  
  constructor(
    @Inject(data_providers.PATIENT_REPOSITORY)
    private patientRepository: Repository<Patient>
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const user = new Patient(createPatientDto);
      return await this.patientRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    return await this.patientRepository.find();
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

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    let updatingPatient = new Patient(updatePatientDto);

    try {
      await this.patientRepository.update(id, updatingPatient);
      let user = await this.findOne(id);
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    return await this.patientRepository.delete(id);
  }
}
