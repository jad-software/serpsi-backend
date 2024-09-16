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
    return await this.medicamentInfoRepository.find({
      where: {
        Patient_id,
      },
      relations: ['_medicine'],
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

  async update(
    patient_id: string,
    medicament_id: string,
    updateMedicamentInfoDto: UpdateMedicamentInfoDto
  ) {
    let updatingMedicamentInfo = new MedicamentInfo(updateMedicamentInfoDto);

    try {
      await this.medicamentInfoRepository.update(
        {
          Patient_id: patient_id,
          Medicine_id: medicament_id,
        },
        updatingMedicamentInfo
      );
      let medicamentInfo = await this.findOne(patient_id, medicament_id);
      return medicamentInfo;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(patient_id: string, medicament_id: string) {
    return await this.medicamentInfoRepository.delete({
      Patient_id: patient_id,
      Medicine_id: medicament_id,
    });
  }
}
