import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { personProvider } from './providers/person.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PersonsController],
  imports: [DatabaseModule],
  providers: [...personProvider, PersonsService],
})
export class PersonsModule {}
