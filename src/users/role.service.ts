import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/upate-role.dto';
import { Id } from 'src/entity-base/vo/id.vo';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role(createRoleDto.name);
    try {
      const createdRole = this.roleRepository.create(role);
      console.log(createdRole);
      await this.roleRepository.save(createdRole);
      return createdRole;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOneById(id: string): Promise<Role> {
    const roleId = new Id(id);
    return await this.roleRepository.findOneByOrFail({ id: roleId });
  }

  async findOneByName(name: string): Promise<Role> {
    const role = new Role(name);
    return this.roleRepository.findOneOrFail({ where: { ...role } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updated = await this.roleRepository.update(id, { ...updateRoleDto });
    let role = await this.findOneById(id);
    return role;
  }

  async remove(id: string): Promise<any> {
    return this.roleRepository.delete(id);
  }
}
