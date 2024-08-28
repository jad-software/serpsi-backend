import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
   constructor(@Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>) {}
   async create(createRoleDto: CreateRoleDto) :Promise<Role>{
    const role = new Role(createRoleDto.name);
    try{

      const createdRole = this.roleRepository.create(role);
      console.log(createdRole);
      await this.roleRepository.save(createdRole);
      return createdRole;
    }
    catch(err) {
      throw new InternalServerErrorException(err);
    }
  }

  findAll() {
   
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
