import { forwardRef, Module } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { PsychologistsController } from './psychologists.controller';
import { psychologistProvider } from './providers/psychologists.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { PersonsModule } from 'src/persons/persons.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AgendasModule } from './agendas.module';

@Module({
  controllers: [PsychologistsController],
  exports: [PsychologistsService],
  imports: [
    DatabaseModule,
    UsersModule,
    PersonsModule,
    CloudinaryModule,
    forwardRef(() => AgendasModule),
  ],
  providers: [...psychologistProvider, PsychologistsService],
})
export class PsychologistsModule {}
