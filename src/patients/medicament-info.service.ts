import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { data_providers } from '../constants';
import { Id } from '../entity-base/vo/id.vo';
import { Repository } from 'typeorm';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
import { UpdateMedicamentInfoDto } from './dto/medicine/update-medicament-info.dto';
import { MedicamentInfo } from './entities/medicament-info.entity';

@Injectable()
export class MedicamentInfoService {
  constructor(
    @Inject(data_providers.MEDICAMENTINFO_REPOSITORY)
    private medicamentInfoRepository: Repository<MedicamentInfo>
  ) {}

  async create(createMedicamentInfoDto: CreateMedicamentInfoDto) {
    try {
      const medicamentInfo = new MedicamentInfo(createMedicamentInfoDto);
      return await this.medicamentInfoRepository.save(medicamentInfo);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    return await this.medicamentInfoRepository.find();
  }

  async findOne(id: string) {
    let requestedMedicamentInfo = new MedicamentInfo({});
    requestedMedicamentInfo.id = new Id(id);
    try {
      return await this.medicamentInfoRepository.findOneOrFail({
        where: { ...requestedMedicamentInfo },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updateMedicamentInfoDto: UpdateMedicamentInfoDto) {
    let updatingMedicamentInfo = new MedicamentInfo(updateMedicamentInfoDto);

    try {
      await this.medicamentInfoRepository.update(id, updatingMedicamentInfo);
      let medicamentInfo = await this.findOne(id);
      return medicamentInfo;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    return await this.medicamentInfoRepository.delete(id);
  }
}
