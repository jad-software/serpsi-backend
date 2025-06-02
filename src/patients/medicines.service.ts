import {
  BadRequestException,
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

  async create(
    createMedicineDto: CreateMedicineDto,
    hasTransaction: boolean = false
  ) {
    try {
      const medicine = new Medicine(createMedicineDto);
      return await this.medicineRepository.save(medicine, {
        transaction: !hasTransaction,
      });
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

  async findByName(name: string) {
    try {
      name = this.validate(name);
      return await this.medicineRepository
        .createQueryBuilder('medicine')
        .where('LOWER(medicine.name) LIKE LOWER(:name)', {
          name: `${name}%`,
        })
        .getMany();
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  validate(name: string): string {
    if (name.trim().length < 3)
      throw new BadRequestException('nome vazio ou menor que 3 caracteres');
    return name;
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
