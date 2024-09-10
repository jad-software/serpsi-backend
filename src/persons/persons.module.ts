import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { personProvider } from './providers/person.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PersonsController],
  imports: [DatabaseModule, AddressesModule, UsersModule],
  providers: [...personProvider, PersonsService],
})
export class PersonsModule {}
