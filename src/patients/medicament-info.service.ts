import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
import { UpdateMedicamentInfoDto } from './dto/medicine/update-medicament-info.dto';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { MedicinesService } from './medicines.service';
import { Patient } from './entities/patient.entity';

@Injectable()
export class MedicamentInfoService {
  constructor(
    @Inject(data_providers.MEDICAMENTINFO_REPOSITORY)
    private medicamentInfoRepository: Repository<MedicamentInfo>,
    private medicineService: MedicinesService
  ) {}

  async create(
    createMedicamentInfoDto: CreateMedicamentInfoDto,
    patient: Patient
  ): Promise<MedicamentInfo> {
    const medicamentInfo = new MedicamentInfo(createMedicamentInfoDto);
    try {
      let medicine = (
        await this.medicineService.findByName(
          createMedicamentInfoDto.medicine.name
        )
      ).at(0);
      if (!medicine)
        medicine = await this.medicineService.create(
          createMedicamentInfoDto.medicine
        );
      medicamentInfo.medicine = medicine;
      medicamentInfo.patient = patient;
      return await this.medicamentInfoRepository.save(medicamentInfo);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<MedicamentInfo[]> {
    return await this.medicamentInfoRepository.find({
      relations: ['_patient', '_medicine'],
    });
  }

  async findAllToPatient(Patient_id: string): Promise<MedicamentInfo[]> {
    let medicaments = await this.medicamentInfoRepository
      .createQueryBuilder('medicamentInfo')
      .leftJoinAndSelect('medicamentInfo._medicine', '_medicine')
      .where('medicamentInfo.Patient_id = :Patient_id', { Patient_id })
      .getMany();
    return medicaments.map((value) => {
      return new MedicamentInfo(value);
    });
  }

  async findOne(
    patient_id: string,
    medicament_id: string
  ): Promise<MedicamentInfo> {
    let requestedMedicamentInfo = new MedicamentInfo({});
    requestedMedicamentInfo.Patient_id = patient_id;
    requestedMedicamentInfo.Medicine_id = medicament_id;
    try {
      return await this.medicamentInfoRepository.findOneOrFail({
        where: { ...requestedMedicamentInfo },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async remove(patient_id: string, medicament_id: string) {
    let medicamentInfo = new MedicamentInfo({});
    medicamentInfo.Patient_id = patient_id;
    medicamentInfo.Medicine_id = medicament_id;
    return await this.medicamentInfoRepository.delete({ ...medicamentInfo });
  }
}
