import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/upate-role.dto';
import { Id } from 'src/entity-base/vo/id.vo';
import { data_providers } from 'src/constants';

@Injectable()
export class RoleService {
  constructor(
    @Inject(data_providers.ROLE_REPOSITORY) private roleRepository: Repository<Role>
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role(createRoleDto);
    try {
     return await this.roleRepository.save(role);
     
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOneById(id: string): Promise<Role> {
    const roleId = new Id(id);
    try {
      return await this.roleRepository.findOneByOrFail({ id: roleId });
    } catch (err) {
      throw new NotFoundException('Role not found');
    }
  }

  async findOneByName(name: string): Promise<Role> {
    const role = new Role({name});
    try {
      return this.roleRepository.findOneOrFail({ where: { ...role } });
    } catch (err) {
      throw new NotFoundException('Role not found');
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updated = await this.roleRepository.update(id, { ...updateRoleDto });
    let role = await this.findOneById(id);
    return role;
  }

  async remove(id: string): Promise<any> {
    return await this.roleRepository.delete(id);
  }
}
