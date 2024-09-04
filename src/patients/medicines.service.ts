import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicineDto } from './dto/medicine/create-medicine.dto';
import { UpdateMedicineDto } from './dto/medicine/update-medicine.dto';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { data_providers } from '../constants';
import { Id } from '../entity-base/vo/id.vo';

@Injectable()
export class MedicinesService {
  constructor(
    @Inject(data_providers.MEDICINE_REPOSITORY)
    private medicineRepository: Repository<Medicine>
  ) {}

  async create(createMedicineDto: CreateMedicineDto) {
    try {
      const medicine = new Medicine(createMedicineDto);
      return await this.medicineRepository.save(medicine);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    return await this.medicineRepository.find();
  }

  async findOne(id: string) {
    let requestedMedicine = new Medicine({});
    requestedMedicine.id = new Id(id);
    try {
      return await this.medicineRepository.findOneOrFail({
        where: { ...requestedMedicine },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto) {
    let updatingMedicine = new Medicine(updateMedicineDto);

    try {
      await this.medicineRepository.update(id, updatingMedicine);
      let medicine = await this.findOne(id);
      return medicine;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    return await this.medicineRepository.delete(id);
  }
}
