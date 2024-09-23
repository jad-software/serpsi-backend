import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Comorbidity } from './entities/comorbidity.entity';
import { Id } from '../entity-base/vo/id.vo';

@Injectable()
export class ComorbiditiesService {
  constructor(
    @Inject(data_providers.COMORBIDITY_REPOSITORY)
    private readonly comorbiditiesRepository: Repository<Comorbidity>
  ) {}

  async create(
    createComorbidityDto: CreateComorbidityDto,
    hasTransaction: boolean = false
  ) {
    const comorbidity = new Comorbidity(createComorbidityDto);
    try {
      return await this.comorbiditiesRepository.save(comorbidity, {
        transaction: !hasTransaction,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAll() {
    return await this.comorbiditiesRepository.find();
  }

  async findOne(id: string) {
    const comorbidity = new Comorbidity({});
    comorbidity.id = new Id(id);
    try {
      return await this.comorbiditiesRepository.findOneOrFail({
        where: { ...comorbidity },
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async findByName(name: string) {
    try {
      name = this.validate(name);

      return await this.comorbiditiesRepository
        .createQueryBuilder('comorbidity')
        .where('LOWER(comorbidity.name) LIKE LOWER(:name)', {
          name: `${name}%`,
        })
        .getMany();
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async remove(id: string) {
    return await this.comorbiditiesRepository.delete(id);
  }

  private validate(name: string) {
    if (name.trim().length < 3)
      throw new BadRequestException('nome vazio ou menor que 3 caracteres');
    return name;
  }
}
