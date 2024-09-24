import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolDto } from './dto/school/create-school.dto';
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { Id } from '../entity-base/vo/id.vo';
import { CNPJ } from './vo/CNPJ.vo';
import { FindSchoolDto } from './dto/school/find-school.dto';
import { Phone } from 'src/persons/vo/phone.vo';
import { AddressesService } from 'src/addresses/Addresses.service';

@Injectable()
export class SchoolService {
  constructor(
    @Inject(data_providers.SCHOOL_REPOSITORY)
    private readonly schoolRepository: Repository<School>,
    private readonly addressService: AddressesService
  ) {}

  async create(
    createSchoolDto: CreateSchoolDto,
    hasTransaction: boolean = false
  ) {
    try {
      const school = new School(createSchoolDto);
      school.CNPJ = new CNPJ(createSchoolDto.CNPJ);
      school.phone = new Phone(createSchoolDto.phone)
      school.address = await this.addressService.create(createSchoolDto.address, true);
      return await this.schoolRepository.save(school, {
        transaction: !hasTransaction,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    return await this.schoolRepository.find();
  }

  async findOne(id: string) {
    let requestedSchool = new School({});
    requestedSchool.id = new Id(id);
    try {
      return await this.schoolRepository.findOneOrFail({
        where: { ...requestedSchool },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async findOneBy(search: FindSchoolDto) {
    let requestedSchool = new School({ ...search });
    try {
      if (search.name)
        requestedSchool.name = this.validateNameInSearch(search.name);

      return await this.schoolRepository
        .createQueryBuilder('school')
        .leftJoinAndSelect('school._address', 'address')
        .where('LOWER(school.name) LIKE LOWER(:name)', {
          name: `%${requestedSchool.name}%`,
        })
        .orWhere('school.CNPJ = :CNPJ', { CNPJ: requestedSchool.CNPJ })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException('escola não encontrada - ' + err.message);
    }
  }

  private validateNameInSearch(name: string) {
    if (name.trim().length < 3)
      throw new BadRequestException('nome vazio ou menor que 3 caracteres');
    return name.trim();
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    let updatingSchool = new School(updateSchoolDto);

    try {
      await this.schoolRepository.update(id, updatingSchool);
      let school = await this.findOne(id);
      return school;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string) {
    return await this.schoolRepository.delete(id);
  }
}
