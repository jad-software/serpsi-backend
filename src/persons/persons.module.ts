import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { personProvider } from './providers/person.providers';
import { DatabaseModule } from 'src/database/database.module';
import { addressProvider } from './providers/address.providers';
import { AdressesController } from './Addresses.controller';
import { AddressesService } from './Addresses.service';

@Module({
  controllers: [PersonsController, AdressesController],
  imports: [DatabaseModule],
  providers: [...personProvider,...addressProvider, PersonsService, AddressesService],
})
export class PersonsModule {}
