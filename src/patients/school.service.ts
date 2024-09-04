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
import { Like, Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { Id } from '../entity-base/vo/id.vo';

@Injectable()
export class SchoolService {
  constructor(
    @Inject(data_providers.SCHOOL_REPOSITORY)
    private readonly schoolRepository: Repository<School>
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    try {
      const school = new School(createSchoolDto);
      return await this.schoolRepository.save(school);
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

  async findOneBy(search: UpdateSchoolDto) {
    let requestedSchool = new School({ ...search });
    try {
      if (search.name)
        requestedSchool.name = this.validateNameInSearch(search.name);

      return await this.schoolRepository
        .createQueryBuilder('school')
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
