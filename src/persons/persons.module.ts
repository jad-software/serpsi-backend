import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { personProvider } from './providers/person.providers';
import { DatabaseModule } from '../database/database.module';
import { AddressesModule } from '../addresses/addresses.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PersonsController],
  imports: [DatabaseModule, AddressesModule, UsersModule, CloudinaryModule],
  providers: [...personProvider, PersonsService],
})
export class PersonsModule {}
