import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleService } from './role.service';
import { roleProvider } from './providers/role.providers';
import { DatabaseModule } from 'src/database/database.module';
import { userProvider } from './providers/user.providers';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule],
  providers: [
    ...roleProvider,
    UsersService,
    RoleService,
    ...userProvider
  ],
  exports:[
    UsersService
  ]
})
export class UsersModule {}
